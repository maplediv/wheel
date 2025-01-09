import React from 'react';
import './index.css';



// ColorTileProps defines the structure of the props that the ColorTile component expects.
// It expects a color object with three properties: red, green, and blue, all of which are numbers.
interface ColorTileProps {
  color: { red: number; green: number; blue: number };
}

// ColorTile is defined as a functional component using React.FC (React Functional Component) with the ColorTileProps interface to enforce the type of the props.
// The component takes color as a prop and destructures it to extract the red, green, and blue values.

//The colorStyle object is created to define the inline CSS styles for the tile.
// backgroundColor is set to an rgb() string, which combines the red, green, and blue values to create the desired color.
// The width, height, and margin properties define the size and spacing of the color tile.
const ColorTile: React.FC<ColorTileProps> = ({ color }) => {
  const { red, green, blue } = color;
  const colorStyle = {
    backgroundColor: `rgb(${red}, ${green}, ${blue})`,
    width: '50px',
    height: '50px',
    margin: '5px',
   
  };

  return <div style={colorStyle}></div>;
};

export default ColorTile;