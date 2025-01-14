import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import VisionAPIComponent from './VisionAPIComponent';
import ColorTiles from './ColorTiles';
import { useAuth } from './AuthContext';

interface ColorResponse {
  responses?: {
    imagePropertiesAnnotation?: {
      dominantColors?: {
        colors: {
          color: { red: number; green: number; blue: number };
        }[];
      };
    };
  }[];
}

const PaintPage: React.FC = () => {
  const [colorResponse, setColorResponse] = useState<ColorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const auth = useAuth();

  const handleColorResponse = (response: ColorResponse) => {
    setColorResponse(response);
    setLoading(false);
    console.log('Received Color Response:', response);
  };

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
          {successMessage && <p className="alert alert-success">{successMessage}</p>}
          {colorResponse ? (
            <ColorTiles
              response={colorResponse.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || []}
              userid={auth.user?.id}
            />
          ) : (
            !loading && <p>No colors to display. Please upload and analyze an image.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaintPage;
