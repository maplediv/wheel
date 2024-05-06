import React from 'react';
import { handleLoginIconClick } from './globalEvents'; // Import the event handler function

const Navbar: React.FC = () => {
  return (
   
   <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <div className="logo-container">
            <img src="/src/images/art.svg" alt="Logo" width="311" height="30" />
          </div>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
            
            
            
                Home
              </a>
            </li>
            <li className="nav-item ">
              <a className="nav-link" href="/paint">
                Paint
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" id="loginIcon" onClick={handleLoginIconClick}>
                <img src="/src/images/login.svg" alt="Login" width="24" height="24" />
              </a>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto"> {/* Added ml-auto class to align items to the right */}
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
