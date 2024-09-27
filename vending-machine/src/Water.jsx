
import React, {useState} from "react";
import { Link } from 'react-router-dom';

import water1 from "./water.jpeg";
import './Water.css';

const Water = () => {
    const [waterBottles, setWaterBottles] = useState([]);

    const getWater = () => {
        const x = window.innerWidth * Math.random();
        const y = window.innerHeight * Math.random();
        setWaterBottles(items=>[...items, {x, y}]);
    }

    const waterImgs = waterBottles.map((bottle, i) => (
        <img src={water1} alt="img" key={i} className="water-img" style={{ top: `${bottle.y}px`, left: `${bottle.x}px` }}/>
    ));


    return (
        <div className="water">
            <div className="water-card">
                <p>So far you have {waterBottles.length} waters</p>
                <p>Buy another one?</p>
                <button onClick={getWater}>More</button>
                <Link to="/">Go Back</Link>
                { ...waterImgs }
            </div>
        </div>
    );
}

export default Water;
