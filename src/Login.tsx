import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you can add logic to handle the account creation request
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);

    // Simulate successful account creation
    // You should replace this with your actual logic
    // For now, just set the success message to true
    setShowSuccessMessage(true);

    // Reset the form fields after submission
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
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
              <p className="mb-0">Already have an account? <button className="btn btn-link" onClick={handleLoginLinkClick}>{showLoginForm ? 'Hide Login Form' : 'Login'}</button></p>
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
