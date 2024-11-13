import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

interface Color {
  red: number;
  green: number;
  blue: number;
}

interface Palette {
  id: number;
  name: string;
  colors: Color[];
}

const PalettesPage: React.FC = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);

  useEffect(() => {
    const fetchPalettes = async () => {
      try {
        const response = await fetch('/api/palettes');
        const data = await response.json();
        setPalettes(data);
      } catch (error) {
        console.error('Error fetching palettes:', error);
      }
    };

    fetchPalettes();
  }, []);

  return (
    <div className="home-page-container">
      <Helmet>
        <title>Saved Palettes</title>
      </Helmet>
      <h1>Saved Color Palettes</h1>
      
      <div className="container home-page-content">
        <div className="row align-items-start">
          <div className="col-md-6">
            <div className="text-container">
              <div className="text-left">
                <h2>Explore Your Color Creations</h2>
                <p className="responsive-text">
                  Here are the color palettes you've saved. Click on any palette to view its details or make edits.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-container">
              <div className="text-left">
                <div className="image-container-home">
                  <img src="/src/images/palettes-image.jpg" alt="Color Palettes" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {palettes.length === 0 ? (
        <p>No palettes saved yet.</p>
      ) : (
        <ul>
          {palettes.map((palette) => (
            <li key={palette.id}>
              <h3>{palette.name || 'Untitled'}</h3>
              <div>
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
                      width: '50px',
                      height: '50px',
                      display: 'inline-block',
                      margin: '5px',
                    }}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PalettesPage;
