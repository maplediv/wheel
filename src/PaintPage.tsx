import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import VisionAPIComponent from './VisionAPIComponent';
import ColorTiles from './ColorTiles';

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

const PaintPage: React.FC = () => {
  const [colorResponse, setColorResponse] = useState<ColorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleColorResponse = (response: ColorResponse) => {
    setColorResponse(response);
    setLoading(false); // Stop loading when response is received

    // Save the palette to localStorage
    const colors = response.responses?.[0].imagePropertiesAnnotation?.dominantColors.colors || [];
    const palette = colors.map((color) => ({
      red: Math.round(color.color.red * 255),
      green: Math.round(color.color.green * 255),
      blue: Math.round(color.color.blue * 255),
    }));

    localStorage.setItem('savedPalette', JSON.stringify(palette));
  };

  const userId = 123; // Example userId, replace it with the actual value (could be dynamic or from context)

  return (
    <div className="container">
      <Helmet>
        <title>Color Canvas</title>
      </Helmet>
      
      <div className="row justify-content-center align-items-start">
        <div className="col-md-6">
          <div className="text-left">
            <h1 className="left-h1">Color Canvas</h1>
            <div className="color-text">
              <ul className="custom-ul">
                <li className="custom-list-item">
                  Click the "Choose File" button and upload any image file to extract its dominant colors.
                </li>
                <br />
                <li className="custom-list-item">
                  Click the "Analyze Image" button to trigger the image analysis.
                </li>
                <br />
                <li className="custom-list-item">
                  The tool supports various image file types, including JPEG, PNG, GIF, BMP, TIFF, WEBP, and more.
                </li>
              </ul>
            </div>
            <VisionAPIComponent onColorResponse={handleColorResponse} />
          </div>
        </div>

        <div className="col-md-6">
          {colorResponse ? (
            // Pass the response and userId props to ColorTiles
            <ColorTiles response={colorResponse} userId={userId} />
          ) : (
            !loading && <p>No colors to display. Please upload and analyze an image.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaintPage;
