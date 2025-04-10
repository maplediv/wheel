import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import ColorTiles from './ColorTiles';
import './index.css';
import VisionAPIComponent from './VisionAPIComponent';
import LoginPage from './Login';
import { AuthProvider } from './AuthContext';
import { Helmet } from 'react-helmet';
import PalettesPage from './PalettesPage';
import artGif from './images/art.gif';


interface ColorResponse {
  responses?: {
    imagePropertiesAnnotation?: {
      dominantColors?: {
        colors: {
          color: { red: number; green: number; blue: number };
          score: number;
          pixelFraction: number;
        }[];
      };
    };
  }[];
}

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h1>Welcome to Art Genius!</h1>
      <div className="container home-page-content">
        <div className="">
          <div className="">
            <div className="">
              <div className="">
                <p className="responsive-text">
                  Visual artists can elevate their creative process by using our app's sophisticated color image recognition feature.
                  By uploading images, artists can seamlessly identify and analyze the color palette within their artwork, enabling them to experiment with new hues and shades.
                </p>
                <button className="full-width-mobile btnprm" onClick={() => { window.location.href = '/paint'; }}>Try Now</button>
                <div className="video-card">
                  <div className="image-container-home">
                    <img 
                      src={artGif}
                      alt="Art Genius Demo"
                      style={{ 
                        width: "100%", 
                        maxWidth: "600px", 
                        height: "auto",
                        border: "1px solid rgba(0, 0, 0, 0.1)"
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaintPage: React.FC = () => {
  const [colorResponse, setColorResponse] = useState<ColorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleColorResponse = (response: ColorResponse) => {
    setColorResponse(response);
    setLoading(false);
  };

  return (
    <div className="container">
      <Helmet>
        <title>Color Canvas</title>
      </Helmet>
      
      <div className="row justify-content-center align-items-start">
        <div className="col-md-6">
          <div className="text-left">
            <div className="color-canvas">
              <h1>Color Canvas</h1>
              <div className="color-text">
                <ul className="custom-ul">
                  <li className='custom-list-item'>Click the "Choose File" button and upload any file to return the dominant colors in the image.</li>
                  <br />
                  <li className='custom-list-item'>Click the "Analyze Image" button to initialize the image analysis processing.</li>
                  <br />
                  <li className='custom-list-item'>Color Canvas supports a variety of image file types, including but not limited to: JPEG, PNG, GIF (including animated GIFs), BMP, TIFF, WEBP.</li>
                </ul>
              </div>
              <VisionAPIComponent onColorResponse={handleColorResponse} />
            </div>
          </div>
        </div>
        <div className="col-md-6 color-table-column">
          {colorResponse && <ColorTiles response={colorResponse} />}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/paint" element={<PaintPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/palettes" element={<PalettesPage />} /> 
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
