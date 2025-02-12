import React, { useState } from 'react';
import axios from 'axios';
import ColorTile from './ColorTile';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

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
  const [successMessage, setSuccessMessage] = useState<string>(''); // State for success message
  const navigate = useNavigate();  // Initialize the navigate function

  const colors = response?.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];

  const handleSavePalette = async () => {
    if (!user || !user.userId) {
      console.error('No user logged in or missing userId');
      setErrorMessage('Please log in to save palettes');
      return;
    }

    try {
      console.log('Attempting to save palette for user:', user.userId);
      const hexCodes = colors.map(color => {
        const { red, green, blue } = color.color;
        return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase();
      });

      console.log('Sending request with hexCodes:', hexCodes);
      const response = await axios.post(`${API_BASE_URL}/api/palettes`, {
        userId: user.userId,
        hexCodes
      });

      if (response.status === 201) {
        setSuccessMessage('Palette saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Save palette error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage(`Error saving palette: ${error.response?.data?.error || 'Please try again.'}`);
        }
      } else {
        setErrorMessage('Error saving palette. Please try again.');
      }
      setTimeout(() => setErrorMessage(''), 3000);
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

  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="color-tiles-container">
      <div className="color-table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Colors (Hex Codes and Tiles)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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

      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      <div className="palspace full-width-mobile">
        <button onClick={handleSavePalette} className="btnprm full-width-mobile">Save Palette</button>
        <button onClick={() => navigate('/palettes')} className="full-width-mobile custom-button">
          View Palettes
        </button>
      </div>
    </div>
  );
};

export default ColorTiles;
