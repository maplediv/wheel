import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
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

  const handleLoginLinkClick = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleLoginFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you can add logic to handle the login form submission
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-control input-small"
                placeholder="First Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-control input-small"
                placeholder="Last Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control input-small"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control input-small"
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="custom-margin-bottom">Already have an account? <button type="button" class="btn btn-link">Login</button></p>

            </div>
          </form>
          {showSuccessMessage && (
            <div className="alert alert-success mt-3" role="alert">
              Account created successfully! You can now login.
            </div>
          )}
          {showLoginForm && (
            <form onSubmit={handleLoginFormSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
