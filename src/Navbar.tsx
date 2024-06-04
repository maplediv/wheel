import React, { useState, useEffect } from 'react';
import { handleLoginIconClick } from './globalEvents'; // Ensure this import is correct or define it below

const Navbar: React.FC = () => {
  const [userFirstName, setUserFirstName] = useState<string | null>(null);

  useEffect(() => {
    console.log('User first name:', userFirstName);
  }, [userFirstName]);

  const handleSuccessfulLogin = (firstName: string) => {
    console.log('User logged in successfully:', firstName);
    setUserFirstName(firstName);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <div className="logo-container">
            <img src="/src/images/art.svg" alt="Logo" width="100" height="100" />
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
            <li className="nav-item">
              <a className="nav-link" href="/paint">
                Paint
              </a>
            </li>
            <li className="nav-item">
              {userFirstName ? (
                <span className="nav-link">Welcome, {userFirstName}</span>
              ) : (
                <a className="nav-link" href="#" id="loginIcon">
                  <img src="/src/images/login.svg" alt="Login" width="24" height="24" />
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
