import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { useAuth } from './AuthContext';
import ColorTiles from './ColorTiles';  // Adjust the path according to your project structure
import { useNavigate } from 'react-router-dom';


interface VisionAPIComponentProps {
  onColorResponse: (response: any) => void;
}

const VisionAPIComponent: React.FC<VisionAPIComponentProps> = ({ onColorResponse }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [colorData, setColorData] = useState<any | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const publicUrl = URL.createObjectURL(file);
      setImageUrl(publicUrl);
    }
  };

  const handleImageAnalysis = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!imageUrl) {
      console.error('Image URL is missing.');
      return;
    }

    const apiKey: string | undefined = import.meta.env.VITE_REACT_APP_GOOGLE_VISION_API_KEY;
    if (!apiKey) {
      console.error('API key is missing.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const requestData = {
          requests: [
            {
              features: [
                {
                  maxResults: 10,
                  type: 'IMAGE_PROPERTIES',
                },
              ],
              image: {
                content: base64Data.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
          ],
        };

        const apiEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
        const visionResponse = await axios.post(apiEndpoint, requestData);

        // Pass the raw response data to the parent component
        onColorResponse(visionResponse.data);

        // Extract and update the colorData state
        const colors = visionResponse.data.responses[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];
        setColorData(colors);

        // Save the palette to localStorage
        const existingPalettes = JSON.parse(localStorage.getItem('savedPalette') || '[]');
        const newPalette = {
          id: existingPalettes.length + 1,
          userId: user?.userId,
          name: `Palette ${existingPalettes.length + 1}`,
          colors: colors.map((color: any) => ({
            red: Math.round(color.color.red),
            green: Math.round(color.color.green),
            blue: Math.round(color.color.blue),
          })),
        };
        localStorage.setItem('savedPalette', JSON.stringify([...existingPalettes, newPalette]));

        setLoading(false);
      };
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('An error occurred while analyzing the image.');
      setLoading(false);
    }
  };

  return (
    <div className="vision-api-container">
      <div className="upload-button-container">
        <label htmlFor="fileInput" className="btn btn-primary custom-button full-width-mobile">
          Choose File
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            className="custom-file-input"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>
        <button
          className="btn btn-primary custom-button full-width-mobile"
          onClick={handleImageAnalysis}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>
  
      {loading && <div className="spinner"></div>}
  
      {imageUrl && (
        <div className="image-table-container">
          <div className="image-container">
            <img src={imageUrl} alt="Uploaded Image" className="uploaded-image" />
          </div>
          <div className="color-tiles-wrapper">
            {colorData && <ColorTiles response={colorData} userId={user?.userId} />}
          </div>
        </div>
      )}
  
      {error && <div className="error-message">{error}</div>}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button type="button" className="close" onClick={() => setShowLoginModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Please log in or create an account to analyze images and save palettes.</p>
              </div>
              <div className="modal-footer">
                
                <button className="btn btn-primary" onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}>
                  Login
                </button>
                <button className="btn btn-success" onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login', { state: { showCreateAccount: true } });
                }}>
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionAPIComponent;
