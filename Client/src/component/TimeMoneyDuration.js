import React, { useState } from 'react';
import styles from './TimeMoneyDuration.module.css';
import { FaTimes } from 'react-icons/fa'; // Close icon

const TimeMoneyDuration = ({
  minMoney,
  maxMoney,
  setMinMoney,
  setMaxMoney,
  duration,
  setDuration,
  closeModal,
  submitModal
}) => {
  const [sliderValue, setSliderValue] = useState(1); // Default to 1 hour

  // Handle duration slider change (divided into hours, max 168 for 1 week)
  const handleSliderChange = (event) => {
    setSliderValue(Number(event.target.value));
    setDuration(Number(event.target.value)); // Update duration in hours
  };

  // Helper function to format duration in days and hours
  const formatDuration = (hours) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const handleSubmit = () => {
    submitModal(); // Submit the form after setting values
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <FaTimes className={styles.closeIcon} onClick={closeModal} />
        <h3>Set Time, Money, and Duration</h3>

        {/* Money input fields */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Min Amount ($)</label>
          <input
            type="number"
            min="0"
            value={minMoney}
            onChange={(e) => setMinMoney(Number(e.target.value))}
            className={styles.textInput}
            placeholder="Enter minimum amount"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Max Amount ($)</label>
          <input
            type="number"
            min="0"
            value={maxMoney}
            onChange={(e) => setMaxMoney(Number(e.target.value))}
            className={styles.textInput}
            placeholder="Enter maximum amount"
          />
        </div>

        {/* Duration slider (in hours) */}
        <div className={styles.sliderContainer}>
          <label className={styles.label}>Duration (up to 1 week)</label>
          <input
            type="range"
            min="1"
            max="168" // 1 week = 168 hours
            value={sliderValue}
            onChange={handleSliderChange}
            className={styles.rangeSlider}
          />
          <div className={styles.rangeValues}>
            <span>{formatDuration(sliderValue)}</span>
          </div>
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default TimeMoneyDuration;
