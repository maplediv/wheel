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

const ColorTiles: React.FC<ColorTilesProps> = ({ response }) => {
  const { user } = useAuth();
  const userId = user?.userId;
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>(''); // State for success message
  const navigate = useNavigate();  // Initialize the navigate function

  const colors = response?.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];

  const handleSavePalette = async () => {
    if (!userId) {
      console.error('User ID is missing. Please log in.');
      return;
    }

    try {
      const hexCodes = colors.map((color) => {
        const hexCode = `#${Math.round(color.color.red).toString(16).padStart(2, '0')}${Math.round(color.color.green).toString(16).padStart(2, '0')}${Math.round(color.color.blue).toString(16).padStart(2, '0')}`.toUpperCase();
        return hexCode;
      });

      console.log('Sending palette data:', { userId, hexCodes });

      const response = await fetch('http://localhost:10000/api/palettes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, hexCodes }),
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      const newPalette: Palette = {
        id: Date.now(),
        name: `Palette ${Date.now()}`,
        colors,
      };

      setSavedPalettes((prevPalettes) => [...prevPalettes, newPalette]);

      // Show success message
      setSuccessMessage('Palette saved successfully!');

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
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

  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="color-tiles-container">
      <div className="color-table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Colors</th>
              <th>Hex Code</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color, index) => {
              const hexCode = `#${Math.round(color.color.red).toString(16).padStart(2, '0')}${Math.round(color.color.green).toString(16).padStart(2, '0')}${Math.round(color.color.blue).toString(16).padStart(2, '0')}`.toUpperCase();
              return (
                <tr key={index}>
                  <td className="color-tile">
                    <ColorTile color={color.color} />
                  </td>
                  <td className="hex-code">{hexCode}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Display success message with Bootstrap classes */}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      <div className="save-palette-container">
        <button onClick={handleSavePalette} className="btn btn-primary">Save Palette</button>
        
        {/* Add a new button to navigate to the palettes page */}
        <button onClick={() => navigate('/palettes')} className="btn btn-primary" style={{ marginLeft: '10px' }}>
          View Palettes
        </button>
      </div>
    </div>
  );
};

export default ColorTiles;
