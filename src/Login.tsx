import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  handleSuccessfulLogin: (firstName: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ handleSuccessfulLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState('');

  const [userFirstName, setUserFirstName] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('User first name:', userFirstName);
  }, [userFirstName]);

  const handleLoginSuccessful = (firstName: string) => {
    console.log('User logged in successfully:', firstName);
    setUserFirstName(firstName);
    setShowLoginForm(false);
    handleSuccessfulLogin(firstName);
    navigate('/'); // Redirect to home page after login
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

        const userResponse = await fetch(`https://wheelback.onrender.com/user?email=${email}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const firstName = userData.firstname;
          handleLoginSuccessful(firstName);
        }

        setShowSuccessMessage(true);
        setShowErrorMessage('');
        setEmail('');
        setPassword('');
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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>{showLoginForm ? 'Login' : 'Create Account'}</h2>
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
              <button type="submit" className="btn btn-primary">{showLoginForm ? 'Login' : 'Create Account'}</button>
              <div className="mt-3">
                <p className="footer-text">
                  {showLoginForm ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button type="button" className="btn btn-link" onClick={() => setShowLoginForm(!showLoginForm)}>
                    {showLoginForm ? 'Create Account' : 'Login'}
                  </button>
                </p>
              </div>
            </form>
          </div>
          {showSuccessMessage && (
            <div className="alert alert-success mt-3" role="alert">
              {showLoginForm ? 'Logged in successfully!' : 'Account created successfully! You can now login.'}
            </div>
          )}
          {showErrorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {showErrorMessage}
            </div>
          )}
        </div>
      </div>
      <div>
        <nav>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            setShowLoginForm(true);
          }}>Login</a>
        </nav>
        {userFirstName && <p>Welcome, {userFirstName}!</p>}
      </div>
    </div>
  );
};

export default LoginPage;
