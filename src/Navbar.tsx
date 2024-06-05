import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <div className="logo-container">
              <img src="/src/images/art.svg" alt="Logo" width="100" height="100" />
            </div>
          </Link>

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
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/paint">
                  Paint
                </Link>
              </li>
              <li className="nav-item">
                {userFirstName ? (
                  <span className="nav-link">Welcome, {userFirstName}</span>
                ) : (
                  <Link className="nav-link" to="/login">
                    <img src="/src/images/login.svg" alt="Login" width="24" height="24" />
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
