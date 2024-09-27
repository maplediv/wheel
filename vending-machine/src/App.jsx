
import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VendingMachine from './VendingMachine';


import Chips from './Chips';
import Candy from './Candy';
import Water from './Water';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<VendingMachine />} />
            <Route exact path="/water" element={<Water />} />
            <Route exact path="/chips" element={<Chips />} />
            <Route exact path="/candy" element={<Candy />} />
        </Routes>
      </BrowserRouter>  
    </div>
  );
}

export default App;
