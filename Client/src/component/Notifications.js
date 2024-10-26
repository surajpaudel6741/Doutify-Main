// Notifications.js
import React, { useEffect, useState } from 'react';
import styles from './Notifications.module.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/notifications')  // Placeholder for actual API endpoint
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div className={styles.notificationsContainer}>
      <h3>Notifications</h3>
      {notifications.map((notification, index) => (
        <div key={index} className={styles.notification}>
          <p>{notification.message}</p>
          <span>{notification.time}</span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
