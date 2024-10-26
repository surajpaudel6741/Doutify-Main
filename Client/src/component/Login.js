import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  console.log("App is rreee")
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log(data);
        Cookies.set('token', data.token, { expires: 7, path: '/' });
        toast.success('Login successful!');
        // navigate('/');
        // navigate('/intial')
        setTimeout(() => {
          navigate('/initial')}, 1500);
      } else {
        toast.error(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className={styles.input}
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      <ToastContainer />
    </div>
  );
};

export default Login;