import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from './Navbar';
import ColorTiles from './ColorTiles'; // Import ColorTiles component
import './index.css';
import VisionAPIComponent from './VisionAPIComponent';
import LoginPage from './Login';



// Define your home page component
const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Art Genius!</h1>
      
      {/* First section */}
      <div className="container-fluid">
        <div className="row align-items-start">
          <div className="col-md-6 order-md-1">
            <div className="text-left">
              <h2 className="align-top">The Artist needs <br />tools to create</h2>
              <p className="responsive-text">
                This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text.<br /> This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text.
              </p>
              <button className="home-button" onClick={() => { window.location.href = '/apod'; }}>Try Now</button>
            </div>
          </div>
          <div className="col-md-6 order-md-2">
            <div className="text-left">
              <div className="image-container-home">
                <img src="/src/images/biglandscape1.jpg" alt="landscape painting" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Second section */}
      <div className="container-fluid">
        <div className="row align-items-start">
          <div className="col-md-6 order-md-4">
            <div className="text-left">
              <h2 className="align-top">This is some H2 <br />text</h2>
              <p className="responsive-text">
                This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text.<br /> This is some paragraph text. This is some paragraph text. <br />This is some paragraph text. This is some paragraph text.
              </p>
              <button className="home-button" onClick={() => { window.location.href = '/apod'; }}>View Photo</button>
            </div>
          </div>
          <div className="col-md-6 order-md-3">
            <div className="text-left">
              <div className="image-container-home">
                <img src="/src/images/acrylic1.jpg" alt="Picasso Picture" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define your paint page component
const PaintPage: React.FC = () => {
  const [colorResponse, setColorResponse] = useState<any>(null); // State to store color response
  const [loading, setLoading] = useState(false); // State to manage loading status

  // Callback function to receive color response from VisionAPIComponent
  const handleColorResponse = (response: any) => {
    setColorResponse(response);
    setLoading(false); // Set loading to false after receiving response
  };

  return (
    <div className="color-canvas">
      <h1>Color Canvas</h1>
      <p className="color-text">
        Click the "Choose File" button and upload any file to return the dominant colors in the image. <br />
        Click the "Analyze Image" button to initialize the image analysis processing.<br />
        Color Canvas supports a variety of image file types, including but not limited to:
        JPEG,
        PNG,
        GIF (including animated GIFs),
        BMP,
        TIFF,
        WEBP.
      </p>
      {/* Display VisionAPIComponent only on the paint page */}
      <VisionAPIComponent onColorResponse={handleColorResponse} />
      {/* Display color tiles if color response is available */}
      {colorResponse && <ColorTiles response={colorResponse} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paint" element={<PaintPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
