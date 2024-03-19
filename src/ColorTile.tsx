import React from 'react';

interface ColorTileProps {
  color: { red: number; green: number; blue: number };
}

const ColorTile: React.FC<ColorTileProps> = ({ color }) => {
  const { red, green, blue } = color;
  const colorStyle = {
    backgroundColor: `rgb(${red}, ${green}, ${blue})`,
    width: '50px',
    height: '50px',
    margin: '5px',
    border: '1px solid black',
  };

  return <div style={colorStyle}></div>;
};

export default ColorTile;