import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    let newErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Please provide a valid username';
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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the JWT and user, then go to Home
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = name && password && !loading;

  return (
    <div>
      <h2>Login Form</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <p style={{ color: 'red' }}>{errors.name}</p>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p>
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
