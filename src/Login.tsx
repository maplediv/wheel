import React, { useState, useEffect } from 'react';

const LoginPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    // Replace history.push('/login') with your desired logic for handling the click event
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted');
    try {
      const response = await fetch('https://wheelback.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      } else {
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLoginFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Add logic to handle login form submission
  };

  const handleLoginLinkClick = () => {
    setShowLoginForm(true);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {showLoginForm ? (
            <>
              <h2>Login</h2>
              <form onSubmit={handleLoginFormSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <div className="mt-3">
                  <p>Don't have an account? <button type="button" className="btn btn-link" onClick={() => setShowLoginForm(false)}>Create Account</button></p>
                </div>
              </form>
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
                  <p>Already have an account? <button type="button" className="btn btn-link" onClick={handleLoginLinkClick}>Login</button></p>
                </div>
              </form>
              {showSuccessMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  Account created successfully! You can now login.
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
