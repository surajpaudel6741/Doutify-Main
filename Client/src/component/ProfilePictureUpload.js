// ProfilePictureUpload.jsx
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import styles from './ProfilePictureUpload.module.css';

const ProfilePictureUpload = ({ onImageUpdate }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageUpdate(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpdate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className={styles.fileInput}
      />
      
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Profile preview" className={styles.preview} />
            <button 
              className={styles.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <Camera size={32} className={styles.cameraIcon} />
            <p>Click or drag image here</p>
            <Upload size={24} className={styles.uploadIcon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;