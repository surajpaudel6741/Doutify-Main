import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessPopup.module.css';

export default function SuccessPopup({ onClose }) {
  const navigate = useNavigate();

  const handleGoToExpert = () => {
    onClose(); // Close the popup
    navigate('/expert'); // Navigate to the /expert page
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Congrats! You are now an Expert!</h2>
        <p>Keep solving doubts and sharing your expertise.</p>
        <button className={styles.goButton} onClick={handleGoToExpert}>
          Let's Go
        </button>
      </div>
    </div>
  );
}
