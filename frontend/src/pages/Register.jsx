import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    let newErrors = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration success - navigate to login
      navigate('/login');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = username && email && password && !loading;

  return (
    <div>
      <h2>Register Form</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && (
          <p style={{ color: 'red' }}>{errors.username}</p>
        )}

        <br />

        <label htmlFor="email">Email</label>
        <br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p style={{ color: 'red' }}>{errors.email}</p>
        )}

        <br />

        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p style={{ color: 'red' }}>{errors.password}</p>
        )}

        <br />
        <br />

        {serverError && (
          <p style={{ color: 'red' }}>{serverError}</p>
        )}

        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
