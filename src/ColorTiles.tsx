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
    <div className="color-tile-container">
      {colors.map((color, index) => (
        <div key={index} className="color-tile">
          <ColorTile color={color.color} />
          <div className="hex-code-blocks"> {/* Add this div with the class */}
            <div>Hex: #{color.color.red.toString(16).padStart(2, '0').toUpperCase()}
              {color.color.green.toString(16).padStart(2, '0').toUpperCase()}
              {color.color.blue.toString(16).padStart(2, '0').toUpperCase()}</div>
            <div>Red: #{color.color.red.toString(16).padStart(2, '0').toUpperCase()} ({(color.color.red / 255 * 100).toFixed(2)}%)</div>
            <div>Green: #{color.color.green.toString(16).padStart(2, '0').toUpperCase()} ({(color.color.green / 255 * 100).toFixed(2)}%)</div>
            <div>Blue: #{color.color.blue.toString(16).padStart(2, '0').toUpperCase()} ({(color.color.blue / 255 * 100).toFixed(2)}%)</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorTiles;
