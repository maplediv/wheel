import React, { useState } from 'react';
import axios from 'axios';
import VisionAPIComponent from './VisionAPIComponent';
import ColorTiles from './ColorTiles'; // Import ColorTiles component
import './index.css';

const App: React.FC = () => {
  const [colorResponse, setColorResponse] = useState<any>(null); // State to store color response
  const [loading, setLoading] = useState(false); // State to manage loading status

  // Callback function to receive color response from VisionAPIComponent
  const handleColorResponse = (response: any) => {
    setColorResponse(response);
    setLoading(false); // Set loading to false after receiving response
  };

  return (
    <div className="App">
      <h1>Color Detection</h1>
      {/* Display VisionAPIComponent */}
      <VisionAPIComponent onColorResponse={handleColorResponse} />
      {/* Display color tiles if color response is available */}
      {colorResponse && <ColorTiles response={colorResponse} />}
    </div>
  );
};

export default App;
