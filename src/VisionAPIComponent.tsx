import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const VisionAPIComponent: React.FC<{ onColorResponse: (response: any) => void }> = ({ onColorResponse }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const publicUrl = URL.createObjectURL(file);
      setImageUrl(publicUrl);
    }
  };

  const handleImageAnalysis = async () => {
    if (!imageUrl) {
      console.error('Image URL is missing.');
      return;
    }
  
    const apiKey: string | undefined = import.meta.env.VITE_REACT_APP_GOOGLE_VISION_API_KEY;
    if (!apiKey) {
      console.error('API key is missing.');
      return;
    }
  
    setLoading(true); // Set loading state to true before making the request
  
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
        onColorResponse(visionResponse.data);
        setLoading(false); // Set loading state to false after handling the response
      };
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('An error occurred while analyzing the image.');
      setLoading(false); // Set loading state to false in case of error
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
        <button className="btn btn-primary custom-button full-width-mobile" onClick={handleImageAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>

      {loading && (
        <div className="spinner"></div>
      )}
      {imageUrl && (
        <div className="image-table-container">
          <div className="image-container">
            <img src={imageUrl} alt="Uploaded Image" className="uploaded-image" />
          </div>
          {/* Your table component goes here */}
        </div>
      )}
    </div>
  );
};

export default VisionAPIComponent;
