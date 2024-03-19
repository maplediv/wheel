import React, { useState } from 'react';
import axios from 'axios';
import VisionAPIComponent from './VisionAPIComponent';
import ColorTiles from './ColorTiles'; // Import ColorTiles component

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>(''); // State to store image URL
  const [colorResponse, setColorResponse] = useState<any>(null); // State to store color response
  const [loading, setLoading] = useState(false); // State to manage loading status

  // Callback function to receive color response from VisionAPIComponent
  const handleColorResponse = (response: any) => {
    setColorResponse(response);
    setLoading(false); // Set loading to false after receiving response
  };

  // Function to handle image analysis using URL
  const handleImageAnalysis = async () => {
    if (!imageUrl) {
      alert('https://picsum.photos/200/300');
      return;
    }

    setLoading(true); // Set loading to true while fetching image

    try {
      // Fetch image content
      await axios.get(imageUrl, { responseType: 'blob' });

      // Pass the object URL to VisionAPIComponent for analysis
      setColorResponse(null); // Reset color response
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('An error occurred while fetching the image. Please try again.');
      setLoading(false); // Set loading to false in case of error
    }
  };

  return (
    <div className="App">
      <h1>Color Detection</h1>
      {/* Input for image URL */}
      <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Enter image URL" />
      {/* Button to trigger image analysis */}
      <button onClick={handleImageAnalysis} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>
      {/* Display VisionAPIComponent */}
      {imageUrl && (
        <VisionAPIComponent
          imageUrl={imageUrl}
          onColorResponse={handleColorResponse}
        />
      )}
      {/* Display color tiles if color response is available */}
      {colorResponse && <ColorTiles response={colorResponse} />}
    </div>
  );
};

export default App;
