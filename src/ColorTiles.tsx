// src/ColorTiles.tsx
import React, { useState } from 'react';
import axios from 'axios';
import ColorTile from './ColorTile';

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
  userId: number;
}

const ColorTiles: React.FC<ColorTilesProps> = ({ response, userId }) => {
  const [savedPalettes, setSavedPalettes] = useState<Color[][]>([]);

  const colors = response?.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];

  // Save palette function
  const handleSavePalette = async () => {
    try {
      // Update the URL to your backend URL
      const res = await axios.post('http://localhost:10000/api/palettes', { userId, palette: colors });
      setSavedPalettes([...savedPalettes, colors]);  // Save the entire palette
      console.log(res.data.message);
    } catch (error) {
      console.error('Error saving palette:', error);
    }
  };
  

  // Delete palette function (updated to delete palette by index)
  const handleDeletePalette = async (paletteIndex: number) => {
    try {
      await axios.delete(`/api/palettes/${paletteIndex}`);
      setSavedPalettes(savedPalettes.filter((_, index) => index !== paletteIndex));
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
        <table>
          <thead>
            <tr>
              <th>Colors</th>
              <th>Hex Code</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color, index) => {
              const hexCode = `#${color.color.red.toString(16).padStart(2, '0')}${color.color.green.toString(16).padStart(2, '0')}${color.color.blue.toString(16).padStart(2, '0')}`.toUpperCase();
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
      <div className="save-palette-container">
        <button onClick={handleSavePalette} className="btn btn-primary">Save Palette</button>
      </div>
    </div>
  );
};

export default ColorTiles;
