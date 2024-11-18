import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const backendUrl = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_REACT_APP_API_URL_PRODUCTION : import.meta.env.VITE_REACT_APP_API_URL_LOCAL;
    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Registration successful');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Network error');
    }
  };

  return (
    <form id="registration-form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="first-name"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        id="last-name"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
