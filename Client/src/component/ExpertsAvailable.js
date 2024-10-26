// ExpertsAvailable.js
import React, { useEffect, useState } from 'react';
import styles from './ExpertsAvailable.module.css';

const ExpertsAvailable = () => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    fetch('/api/experts')  // Placeholder for actual API endpoint
      .then((res) => res.json())
      .then((data) => setExperts(data));
  }, []);

  return (
    <div className={styles.expertsContainer}>
      <h3>Experts Available</h3>
      {experts.map((expert, index) => (
        <div key={index} className={styles.expert}>
          <img src={expert.profileImage} alt={expert.name} className={styles.expertImage} />
          <p>{expert.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ExpertsAvailable;
