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

// Define the Palette type
type Palette = {
  id: number;
  name: string;
  colors: Color[];
};

const ColorTiles: React.FC<ColorTilesProps> = ({ response, userId }) => {
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);

  // Extract colors from the response
  const colors = response?.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];

  // Handle saving a new palette
  const handleSavePalette = async () => {
    try {
      // Send the palette data to the backend
      const res = await axios.post('http://localhost:10000/api/palettes', { userId, palette: colors });

      // Create a new palette object
      const newPalette: Palette = {
        id: Date.now(), // Using the current timestamp as a unique ID
        name: `Palette ${Date.now()}`, // Generating a name for the palette
        colors, // The colors array being saved
      };

      // Update the state with the new palette
      setSavedPalettes((prevPalettes) => [...prevPalettes, newPalette]);

      console.log(res.data.message); // Optionally log a success message
    } catch (error) {
      console.error('Error saving palette:', error); // Log any error
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
              const hexCode = `#${Math.round(color.color.red * 255).toString(16).padStart(2, '0')}${Math.round(color.color.green * 255).toString(16).padStart(2, '0')}${Math.round(color.color.blue * 255).toString(16).padStart(2, '0')}`.toUpperCase();
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
        {/* <button onClick={handleSavePalette} className="btn btn-primary">Save Palette</button> */}
      </div>
      <div className="saved-palettes-container">
        {/* <h3>Saved Palettes:</h3> */}
        <ul>
          {savedPalettes.map((palette) => (
            <li key={palette.id}>
              <strong>{palette.name}</strong>
              <ul>
                {palette.colors.map((color, index) => (
                  <li key={index} style={{ backgroundColor: `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})` }}>
                    Color: {color.score}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleDeletePalette(palette.id)}>Delete Palette</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ColorTiles;
