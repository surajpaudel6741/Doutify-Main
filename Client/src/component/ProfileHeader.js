// ProfileHeader.js
import React from 'react';
import styles from './ProfileHeader.module.css';

const ProfileHeader = () => (
  <div className={styles.profileHeader}>
    <img src="/path/to/profile.jpg" alt="Profile" className={styles.profileImage} />
    <h2>Expert's Name</h2>
    <p className={styles.expertTitle}>Available for consultation</p>
  </div>
);

export default ProfileHeader;
