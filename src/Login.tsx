import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Helmet } from 'react-helmet';

const backendUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_REACT_APP_API_URL_PRODUCTION : import.meta.env.VITE_REACT_APP_API_URL_LOCAL;

const Login: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showRegistrationSuccessMessage, setShowRegistrationSuccessMessage] = useState(false);
  const [showLoginSuccessMessage, setShowLoginSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Register button clicked");
    try {
      const response = await fetch(`${backendUrl}/register`, {
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

  const handleLoginFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Login form submitted");
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status); // Log the response status

      if (response.ok) {
        const data = await response.json();
        console.log('Login data:', data);

        // Check if the user data exists in the response
        if (data.user) {
          const { firstName, email, id: userId } = data.user; // Use 'id' as userId

          // Call your login context or state management
          login({ firstName, email, userId }); // Pass userId here

          setShowLoginSuccessMessage(true);
          setShowErrorMessage('');
          navigate('/'); // Redirect to home or wherever needed
        } else {
          setShowErrorMessage('User data not found');
          setShowLoginSuccessMessage(false);
        }
      } else {
        const data = await response.json();
        console.log('Error data:', data); // Log error message
        setShowErrorMessage(data.message);
        setShowLoginSuccessMessage(false);
      }
    } catch (error) {
      console.log('Error logging in:', error);
      setShowErrorMessage('Error logging in');
      setShowLoginSuccessMessage(false);
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>{showLoginForm ? 'Login' : 'Create Account'}</title>
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className='left-h1'>{showLoginForm ? 'Login' : 'Create Account'}</h1>
          <div className="form-container">
            <form onSubmit={showLoginForm ? handleLoginFormSubmit : handleSubmit}>
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
              <button type="submit" className="btn btn-primary desktop-wide full-width-mobile">{showLoginForm ? 'Login' : 'Create Account'}</button>
              <div className="mt-3">
                <p className="login-text">
                  {showLoginForm ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button type="button" className="btn-link" onClick={() => {
                    setShowLoginForm(!showLoginForm);
                    setShowRegistrationSuccessMessage(false);
                    setShowLoginSuccessMessage(false);
                    setShowErrorMessage('');
                  }}>
                    {showLoginForm ? 'Create Account' : 'Login'}
                  </button>
                </p>
              </div>
            </form>
          </div>

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

export default Login;
