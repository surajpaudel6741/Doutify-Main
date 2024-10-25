import React from 'react';
import styles from './Initial.module.css';

const TimeMoneyDurationModal = ({ 
  minMoney, 
  maxMoney, 
  duration, 
  setMinMoney, 
  setMaxMoney, 
  setDuration, 
  closeModal, 
  submitModal 
}) => {
  // Helper function to convert hours into a string with days and hours
  const formatDuration = (hours) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    // Construct the output string
    let result = '';
    if (days > 0) {
      result += `${days} day(s) `;
    }
    result += `${remainingHours} hour(s)`;

    return result;
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Set Time, Money, and Duration</h2>
        <input
          type="number"
          className={styles.modalInput}
          placeholder="Min Amount ($)"
          value={minMoney}
          onChange={(e) => setMinMoney(Number(e.target.value))}
        />
        <input
          type="number"
          className={styles.modalInput}
          placeholder="Max Amount ($)"
          value={maxMoney}
          onChange={(e) => setMaxMoney(Number(e.target.value))}
        />
        <input
          type="range"
          className={styles.modalInput}
          min="1"
          max="168" // Maximum of 7 days (168 hours)
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <p>Duration: {formatDuration(duration)}</p>
        <button className={styles.modalSubmitBtn} onClick={submitModal}>Submit</button>
        <button className={styles.modalCloseBtn} onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default TimeMoneyDurationModal;
