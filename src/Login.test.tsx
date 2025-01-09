import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Helmet } from 'react-helmet';

const LoginPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true); // Toggle between login and register form
  const [showRegistrationSuccessMessage, setShowRegistrationSuccessMessage] = useState(false);
  const [showLoginSuccessMessage, setShowLoginSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://wheelback.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userResponse = await fetch(`https://wheelback.onrender.com/user?email=${email}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const firstName = userData.firstname;
          login({ firstName, email });
          setShowLoginSuccessMessage(true);
          setShowErrorMessage('');
          navigate('/');
        } else {
          setShowErrorMessage('User fetch failed');
          setShowLoginSuccessMessage(false);
        }
      } else {
        const data = await response.json();
        setShowErrorMessage(data.message);
        setShowLoginSuccessMessage(false);
      }
    } catch (error) {
      setShowErrorMessage('Error logging in');
      setShowLoginSuccessMessage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://wheelback.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.ok) {
        setShowRegistrationSuccessMessage(true);
        setShowErrorMessage('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      } else {
        const data = await response.json();
        setShowErrorMessage(data.message);
        setShowRegistrationSuccessMessage(false);
      }
    } catch (error) {
      setShowErrorMessage('Error registering user');
      setShowRegistrationSuccessMessage(false);
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>{showLoginForm ? 'Login' : 'Create Account'}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="left-h1">{showLoginForm ? 'Login' : 'Create Account'}</h1>
          <div className="form-container">
            <form onSubmit={showLoginForm ? handleLoginFormSubmit : handleSubmit}>
              {/* Render the registration fields if showing the register form */}
              {!showLoginForm && (
                <>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-control"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </>
              )}

              {/* Common input fields for both login and register */}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary desktop-wide full-width-mobile">
                {showLoginForm ? 'Login' : 'Create Account'}
              </button>

              <div className="mt-3">
                <p className="login-text">
                  {showLoginForm ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => {
                      setShowLoginForm(!showLoginForm);
                      setShowRegistrationSuccessMessage(false);
                      setShowLoginSuccessMessage(false);
                      setShowErrorMessage('');
                    }}
                  >
                    {showLoginForm ? 'Create Account' : 'Login'}
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Success and error messages */}
          {showRegistrationSuccessMessage && (
            <div className="alert alert-success mt-3" role="alert">
              Account created successfully! You can now login.
            </div>
          )}
          {showLoginSuccessMessage && (
            <div className="alert alert-success mt-3" role="alert">
              Logged in successfully!
            </div>
          )}
          {showErrorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {showErrorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
