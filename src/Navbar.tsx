import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  userFirstName: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ userFirstName }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
      <a className="navbar-brand" href="#">
            <div className="logo-container">
              <img src="/src/images/art.svg" alt="Logo" width="100" height="100" />
            </div>
          </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
            {userFirstName ? (
              <li className="nav-item">
                <span className="nav-link">Welcome, {userFirstName}</span>
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
