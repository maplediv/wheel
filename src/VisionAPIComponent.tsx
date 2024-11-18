import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

interface VisionAPIComponentProps {
  onColorResponse: (response: any) => void;
}

const VisionAPIComponent: React.FC<VisionAPIComponentProps> = ({ onColorResponse }) => {
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

        // Call onColorResponse to pass the data to the parent component (if necessary)
        onColorResponse(visionResponse.data);

        // Assuming the response contains a palette of colors (adjust as needed based on actual API response)
        const colors = visionResponse.data.responses[0].imagePropertiesAnnotation.dominantColors.colors;

        // Retrieve existing palettes from localStorage
        const existingPalettes = JSON.parse(localStorage.getItem('savedPalette') || '[]');

        // Create a new palette object
        const newPalette = {
          id: existingPalettes.length + 1, // Assign a unique ID
          name: `Palette ${existingPalettes.length + 1}`, // Default name
          colors: colors.map((color: any) => ({
            red: Math.round(color.color.red * 255),
            green: Math.round(color.color.green * 255),
            blue: Math.round(color.color.blue * 255),
          })),
        };

        // Save the updated palette list back to localStorage
        localStorage.setItem('savedPalette', JSON.stringify([...existingPalettes, newPalette]));

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

      {loading && <div className="spinner"></div>}
      {imageUrl && (
        <div className="image-table-container">
          <div className="image-container">
            <img src={imageUrl} alt="Uploaded Image" className="uploaded-image" />
          </div>
          {/* Your table component can go here if needed */}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VisionAPIComponent;
