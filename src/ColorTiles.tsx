import React from 'react';
import ColorTile from './ColorTile';

interface ColorTilesProps {
  response: {
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
  };
}

const ColorTiles: React.FC<ColorTilesProps> = ({ response }) => {
  const colors = response?.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];

  // Render nothing if colors are not available
  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="color-tiles-container"> {/* Ensure correct class */}
      <div className="color-table-container">
        <table>
          <thead>
            <tr>
              <th>Colors</th>
              <th>Hex Code</th>
              <th>Red</th>
              <th>Green</th>
              <th>Blue</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color, index) => (
              <tr key={index}>
                <td className="color-tile">
                  <ColorTile color={color.color} />
                </td>
                <td className="hex-code">
                  #{color.color.red.toString(16).padStart(2, '0').toUpperCase()}
                  {color.color.green.toString(16).padStart(2, '0').toUpperCase()}
                  {color.color.blue.toString(16).padStart(2, '0').toUpperCase()}
                </td>
                <td>{color.color.red}</td>
                <td>{color.color.green}</td>
                <td>{color.color.blue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ColorTiles;
