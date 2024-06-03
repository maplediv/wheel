import React, { useState, useEffect } from 'react';

const LoginPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');

  useEffect(() => {
    const loginIcon = document.getElementById('loginIcon');
    if (loginIcon) {
      loginIcon.addEventListener('click', handleLoginIconClick);
    }
    return () => {
      if (loginIcon) {
        loginIcon.removeEventListener('click', handleLoginIconClick);
      }
    };
  }, []);

  const handleLoginIconClick = (event: MouseEvent) => {
    event.preventDefault();
    console.log('Login icon clicked!');
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
        console.log('User registered successfully');
        setShowSuccessMessage(true);
        setShowErrorMessage('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      } else {
        const data = await response.json();
        console.log('Failed to register user:', data.message);
        setShowErrorMessage(data.message);
        setShowSuccessMessage(false);
      }
    } catch (error) {
      console.log('Error registering user:', error);
      setShowErrorMessage('Error registering user');
      setShowSuccessMessage(false);
    }
  };

  const handleLoginFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Login form submitted');
    try {
      const response = await fetch('https://wheelback.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log('User logged in successfully');
        setShowSuccessMessage(true);
        setShowErrorMessage('');
      } else {
        const data = await response.json();
        console.log('Failed to log in:', data.message);
        setShowErrorMessage(data.message);
        setShowSuccessMessage(false);
      }
    } catch (error) {
      console.log('Error logging in:', error);
      setShowErrorMessage('Error logging in');
      setShowSuccessMessage(false);
    }
  };

  const handleLoginLinkClick = () => {
    setShowLoginForm(true);
    setShowSuccessMessage(false);
    setShowErrorMessage('');
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {showLoginForm ? (
            <>
              <h2>Login</h2>
              <div className="form-container">
                <form onSubmit={handleLoginFormSubmit}>
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
                  <button type="submit" className="btn btn-primary">Login</button>
                  <div className="mt-3">
                    <p className="footer-text">Don't have an account? <button type="button" className="btn btn-link" onClick={() => setShowLoginForm(false)}>Create Account</button></p>
                  </div>
                </form>
              </div>
              {showSuccessMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  Logged in successfully!
                </div>
              )}
              {showErrorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {showErrorMessage}
                </div>
              )}
            </>
          ) : (
            <>
              <h1>Create Account</h1>
              <form onSubmit={handleSubmit}>
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
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary">Create Account</button>
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <p className="footer-text">Already have an account? <button type="button" className="btn btn-link" onClick={handleLoginLinkClick}>Login</button></p>
                </div>
              </form>
              {showSuccessMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  Account created successfully! You can now login.
                </div>
              )}
              {showErrorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {showErrorMessage}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
