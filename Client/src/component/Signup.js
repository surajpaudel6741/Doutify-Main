import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePictureUpload from './ProfilePictureUpload';
const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const navigate = useNavigate();

  const notifyError = (message) => {
    toast.error(message, { position: 'top-right', autoClose: 3000 });
  };

  const notifySuccess = (message) => {
    toast.success(message, { position: 'top-right', autoClose: 3000 });
  };

  const notifyInfo = (message) => {
    toast.info(message, { position: 'top-right', autoClose: 3000 });
  };

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length > 0) {
        try {
          const response = await fetch(`http://localhost:8080/request/userexists?username=${username}`);
          const data = await response.json();
          setUsernameAvailable(!data);
          if (data) {
            notifyInfo('Username is already taken.');
          } else {
            notifyInfo('Username is available.');
          }
        } catch (error) {
          console.error('Error checking username:', error);
        }
      }
    };
    
    const debounceTimer = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [username]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name) {
      notifyError('Full Name is required');
      return;
    }
    if (!username) {
      notifyError('Username is required');
      return;
    }
    if (!usernameAvailable) {
      notifyError('Please choose a different username');
      return;
    }
    if (!email) {
      notifyError('Email is required');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      notifyError('Please enter a valid email address');
      return;
    }
    if (!password) {
      notifyError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullname', name);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        body: formData, // Changed to formData to support file upload
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Could not parse JSON:', jsonError);
        notifyError('An unexpected error occurred. Please try again.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        notifySuccess('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        notifyError(data.message || 'An error occurred during signup.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      notifyError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h2>Sign Up</h2>
      <ProfilePictureUpload onImageUpdate={setProfilePhoto} />
      <form onSubmit={handleSignup}>
        <input
          type="text"
          className={styles.input}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button
          type="submit"
          className={styles.button}
          disabled={loading || !usernameAvailable}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default Signup;