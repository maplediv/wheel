import React, { useState } from 'react';
import axios from 'axios';

const VisionAPIComponent: React.FC<{ imageUrl: string; onColorResponse: (response: any) => void }> = ({ imageUrl, onColorResponse }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageAnalysis = async () => {
    const apiKey: string | undefined = import.meta.env.REACT_APP_GOOGLE_VISION_API_KEY;

    if (!apiKey) {
      console.error('API key is missing.');
      return;
    }

    setLoading(true);

    try {
      // Fetch the image content from the provided URL
      const response = await axios.get(imageUrl, {
        responseType: 'blob', // Set responseType to 'blob' to receive binary data
      });

      // Convert the fetched image content into a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Prepare the request data for the Vision API
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
                content: base64Data.replace(/^data:image\/\w+;base64,/, ''), // Remove the data URL prefix
              },
            },
          ],
        };

        // Make a POST request to the Vision API with the image content
        const apiEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
        const visionResponse = await axios.post(apiEndpoint, requestData);

        // Handle the response from the Vision API
        onColorResponse(visionResponse.data);
      };
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('An error occurred while analyzing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleImageAnalysis} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default VisionAPIComponent;
