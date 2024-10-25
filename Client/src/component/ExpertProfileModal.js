import React, { useState } from 'react';
import styles from './ExpertProfileModal.module.css'; // CSS for the modal
import { Fa500Px } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSwitchExpertContext } from '../context/switchExpertContext';


const ExpertProfileModal = () => {
  const {state,setState} = useSwitchExpertContext()
    const [create, setCreate] = useState(false)
    const navigate = useNavigate()
    if(create){
        navigate("/expertsignup")
    }
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Expert Profile Not Found</h2>
        <p>You do not have an expert profile. Would you like to create one?</p>
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={()=>setState(false)}>Cancel</button>
          <button className={styles.createButton} onClick={()=>setCreate(true)}>Create Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfileModal;
