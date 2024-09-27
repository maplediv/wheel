import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

import RouteList from "./RouteList";
import NavBar from "./NavBar";

/**
 * App
 *
 * state:
  * dogs: [{name...}]
  * isLoading: bool
 *
 * props: none
 *
 * App -> RouteList
 *
 */

function App() {
  const [dogs, setDogs] = useState({
    data: null,
    isLoading: true
  });

  useEffect(() => {
    async function loadDogs(){
      const response = await axios.get("http://localhost:5001/dogs")
      setDogs({
        data: response.data,
        isLoading: false
      })
    }
    loadDogs()
  }, [])

  if (dogs.isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <h1>Welcome!</h1>
      <BrowserRouter>
        <NavBar dogs={dogs.data} />
        <div className="container">
          <RouteList dogs={dogs.data} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
