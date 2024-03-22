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

  return (
    <div className="color-tiles-container"> {/* Ensure correct class */}
      <div className="color-table-container">
        <table>
          <thead>
            <tr>
              <th>Color Tile</th>
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
                <td className="color-value">
                  <div>Red: {color.color.red}</div>
                </td>
                <td className="color-value">
                  <div>Green: {color.color.green}</div>
                </td>
                <td className="color-value">
                  <div>Blue: {color.color.blue}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ColorTiles;
