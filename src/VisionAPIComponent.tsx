import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { useAuth } from './AuthContext';
import ColorTiles from './ColorTiles';  // Adjust the path according to your project structure


interface VisionAPIComponentProps {
  onColorResponse: (response: any) => void;
}

const VisionAPIComponent: React.FC<VisionAPIComponentProps> = ({ onColorResponse }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [colorData, setColorData] = useState<any | null>(null); // Define colorData as a state variable

  const resolvedUserId = user?.userId || localStorage.getItem('userId');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const publicUrl = URL.createObjectURL(file);
      setImageUrl(publicUrl);
    }
  };

  const handleImageAnalysis = async () => {
    if (!imageUrl || !resolvedUserId) {
      console.error('Image URL or User ID is missing.');
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
          userId: resolvedUserId,
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
  
          {/* Render ColorTiles if colorData is available */}
          {colorData && <ColorTiles response={colorData} userId={resolvedUserId} />}
        </div>
      )}
  
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VisionAPIComponent;
