// src/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  console.log('User in Navbar:', user);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <div className="logo-container">
            <img src="/src/images/art.svg" alt="Logo" width="100" height="100" />
          </div>
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/paint">Paint</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/palettes">Palettes</Link>
            </li>

            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {user.firstName}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <button className="dropdown-item logout-button" onClick={logout}>Logout</button>
                </div>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <img src="/src/images/login.svg" alt="Login" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
