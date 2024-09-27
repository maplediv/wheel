import React from 'react';
import { useParams } from 'react-router-dom';
import DogDetails from './DogDetails';


/**
 * FilterDogDetails finds a dog by name or renders null
 *
 * state: none
 *
 * props:
  * dogs: [{name, src}]
 *
 *
  * Rendered at /dogs/:name
 *
 */

function FilterDogDetails({ dogs }) {
  const { name } = useParams();

  if (name) {
    const currentDog = dogs.find(
      dog => dog.name.toLowerCase() === name.toLowerCase()
    );
    return <DogDetails dog={currentDog} />;
  }

  return null;
}

export default FilterDogDetails;