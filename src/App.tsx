// src/App.js
import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import ColorTiles from './ColorTiles';
import './index.css';
import VisionAPIComponent from './VisionAPIComponent';
import LoginPage from './Login';
import { AuthProvider } from './AuthContext';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  return (
    <div className="home-page-container">
       <Helmet>
       <title>Home</title>
      </Helmet>
      <h1>Welcome to Art Genius!</h1>
      <div className="container home-page-content">
        <div className="row align-items-start">
          <div className="col-md-6 order-md-1">
            <div className="text-container">
              <div className="text-left">
                <h2>A tool for artists</h2>
                <p className="responsive-text">
                  Visual artists can elevate their creative process by using our app's sophisticated color image recognition feature.
                  By uploading images, artists can seamlessly identify and analyze the color palette within their artwork, enabling them to experiment with new hues and shades.
                </p>
                <button className="home-button btn btn-primary full-width-mobile" onClick={() => { window.location.href = '/paint'; }}>Try Now</button>
              </div>
            </div>
          </div>
          <div className="col-md-6 order-md-2">
            <div className="text-container">
              <div className="text-left">
                <div className="image-container-home">
                  <img src="/src/images/biglandscape1.jpg" alt="landscape painting" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container home-page-content footer-spacing">
        <div className="row align-items-start">
          <div className="col-md-6 order-md-4">
            <div className="text-container">
              <div className="text-left">
                <h2>Infinite imagination</h2>
                <p className="responsive-text">
                  This tool not only assists in color matching but also offers insights into the dominant colors and their proportions, helping artists maintain harmony and balance in their compositions.
                  Whether refining a piece or seeking inspiration, our app empowers artists to harness the power of color with precision and ease.
                </p>
                <button className="home-button btn btn-primary full-width-mobile" onClick={() => { window.location.href = '/paint'; }}>Learn More</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-container">
              <div className="text-left">
                <div className="image-container-home">
                  <img src="/src/images/acrylic1.jpg" alt="Picasso Picture" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaintPage = () => {
  const [colorResponse, setColorResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleColorResponse = (response) => {
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
              <h1 className='left-h1'>Color Canvas</h1>
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

const App = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default App;
