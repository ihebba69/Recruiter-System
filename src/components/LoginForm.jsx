import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f2f2f2',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          width: '300px',
          textAlign: 'center',
        }}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: 'calc(100% - 20px)',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '3px',
              border: '1px solid #ccc',
            }}
          />
          <input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: 'calc(100% - 20px)',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '3px',
              border: '1px solid #ccc',
            }}
          />
          <a href="#forget-password" style={{ display: 'block', margin: '5px 0' }}>
            Forget password?
          </a>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a0eb',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            LOGIN
          </button>
        </form>
        <div style={{ marginTop: '20px' }}>
          <p>or sign up using</p>
       
          <p style={{ marginTop: '10px' }}>
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;