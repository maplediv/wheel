import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ColorTile from './ColorTile';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Color {
  color: { red: number; green: number; blue: number };
  score: number;
  pixelFraction: number;
}

interface ColorTilesProps {
  response: {
    responses?: {
      imagePropertiesAnnotation?: {
        dominantColors?: {
          colors: Color[];
        };
      };
    }[];
  };
}

// Define the Palette type
type Palette = {
  id: number;
  name: string;
  colors: Color[];
};

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wheelback.onrender.com'
  : 'http://localhost:10000';

const ColorTiles: React.FC<ColorTilesProps> = ({ response }) => {
  const { user } = useAuth();
  const userId = user?.userId;
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const colors = response?.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];

  const handleSavePalette = async () => {
    try {
      console.log('Attempting to save palette for user:', userId);
      
      const hexCodes = colors.map(color => {
        const { red, green, blue } = color.color;
        return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase();
      });

      console.log('Sending request with hexCodes:', hexCodes);
      console.log('Sending palette data:', { userId, hexCodes });

      const response = await fetch(`${API_BASE_URL}/api/palettes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, hexCodes }),
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (response.status === 201) {
        setSuccessMessage('Palette saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else if (response.status === 403) {
        setShowLimitModal(true);
      }
    } catch (error) {
      console.error('Error saving palette:', error);
    }
  };

  const handleDeletePalette = async (paletteId: number) => {
    try {
      await axios.delete(`/api/palettes/${paletteId}`);
      setSavedPalettes(savedPalettes.filter((palette) => palette.id !== paletteId));
    } catch (error) {
      console.error('Error deleting palette:', error);
    }
  };

  useEffect(() => {
    if (showLimitModal) {
      console.log("Modal is visible");
    }
  }, [showLimitModal]);

  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="color-tiles-container">
      <div className="color-table-container">
        <table className="table table-bordered">
       
          <tbody>
            <tr>
            <th>Colors (Hex Codes and Tiles)</th>
              <td className="color-palette-td" data-label="Colors (Hex Codes and Tiles)">
                <div className="color-palette-flex-container">
                  {colors.map((color, index) => {
                    const hexCode = `#${Math.round(color.color.red).toString(16).padStart(2, '0')}${Math.round(color.color.green).toString(16).padStart(2, '0')}${Math.round(color.color.blue).toString(16).padStart(2, '0')}`.toUpperCase();
                    
                    return (
                      <div key={index} className="color-tile-wrapper">
                        <div 
                          className="color-tile"
                          style={{ backgroundColor: hexCode }}
                        />
                        <span className="hex-code">{hexCode}</span>
                      </div>
                    );
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="palspace full-width-mobile">
        {!showLimitModal ? (
          <button onClick={handleSavePalette} className="btnprm full-width-mobile">Save Palette</button>
        ) : (
          <>
            <p className="text-center">Maximum palettes reached. Please delete an existing palette first.</p>
            <button 
              onClick={() => navigate('/palettes')} 
              className="custom-button full-width-mobile"
            >
              View Palettes
            </button>
          </>
        )}
        <button onClick={() => navigate('/palettes')} className="full-width-mobile custom-button">
          View Palettes
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      {showLimitModal && (
        <div 
          className="modal" 
          style={{
            display: 'block',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            pointerEvents: 'none',
          }}
        >
          <div 
            className="modal-dialog" 
            style={{
              margin: '10% auto',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '5px',
              maxWidth: '400px',
              pointerEvents: 'auto',
            }}
          >
            <h5 className="modal-title">Maximum Palettes Reached</h5>
            <p>Please delete an existing palette before creating a new one.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btnprm full-width-mobile"
                onClick={(e) => {
                  console.log('Cancel button clicked');
                  setShowLimitModal(false);
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="custom-button full-width-mobile"
                onClick={(e) => {
                  console.log('View Palettes button clicked');
                  setShowLimitModal(false);
                  console.log('About to navigate to /palettes');
                  navigate('/palettes');
                  console.log('Navigation called');
                }}
              >
                View Palettes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ColorTiles;
