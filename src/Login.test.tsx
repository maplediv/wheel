import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';

// Mock the useAuth hook
jest.mock('./AuthContext', () => {
  const actualModule = jest.requireActual('./AuthContext');
  return {
    ...actualModule,
    useAuth: jest.fn(),
  };
});

const mockLogin = jest.fn();

beforeEach(() => {
  // Directly mock the useAuth hook without type assertion
  (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
});

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <AuthProvider>
        <Router>
          <Login />
        </Router>
      </AuthProvider>
    );
  });

  test('renders the login form', () => {
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('handles login form submission', async () => {
    global.fetch = jest.fn((url, options) => {
      if (url === 'https://wheelback.onrender.com/login') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      if (url.startsWith('https://wheelback.onrender.com/user')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ firstname: 'John' }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as jest.Mock;

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password' },
    });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        firstName: 'John',
        email: 'test@example.com',
      });
      expect(screen.getByText(/logged in successfully!/i)).toBeInTheDocument();
    });
  });

  test('displays error message on login failure', async () => {
    global.fetch = jest.fn((url, options) => {
      if (url === 'https://wheelback.onrender.com/login') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Invalid credentials' }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as jest.Mock;

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
