import React from 'react';
import ColorTile from './ColorTile'; // Import ColorTile here

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
  // Use optional chaining (?) and nullish coalescing (??) to safely access nested properties
  const colors = response?.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];

  return (
    <div>
      {colors.map((color, index) => (
        <ColorTile key={index} color={color.color} />
      ))}
    </div>
  );
};

export default ColorTiles;