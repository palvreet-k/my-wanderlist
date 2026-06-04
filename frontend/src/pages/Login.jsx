import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './Register';

function LoginForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setSubmitted(true);
    }
  };

  const canSubmit = name && password;

  if (submitted) {
    return (
      <div>
        <h2>Login Successful</h2>
        <p>Welcome, {name}!</p>
      </div>
    );
  }

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

        <button type="submit" disabled={!canSubmit}>
          Login
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