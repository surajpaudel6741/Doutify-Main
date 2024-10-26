import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styles from './ExpertSignup.module.css';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import SuccessPopup from './popUps/SuccessPopup.js'

export default function ExpertSignup() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobTitle: '',
    expertise: [],
    links: [{ title: '', url: '' }]
  });
  
  // it has to maintain on the ref function

  const [files, setFiles] = useState({
    resume: null,
    proof: [],
    library: []
  });
  
  const [dragActive, setDragActive] = useState({
    resume: false,
    proof: false,
    library: false
  });

  const fileInputRefs = {
    resume: useRef(),
    proof: useRef(),
    library: useRef()
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExpertiseInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.target.value.trim().replace(/,$/, '');
      if (value && !formData.expertise.includes(value)) {
        setFormData(prev => ({
          ...prev,
          expertise: [...prev.expertise, value]
        }));
        e.target.value = '';
      }
    }
  };

  const handleFileUpload = (type, e) => {
    e.preventDefault();
    const uploadedFiles = e.target.files || e.dataTransfer.files;
  
    console.log(`Uploading files for ${type}`, uploadedFiles); // Debugging line
  
    if (type === 'resume') {
      setFiles(prev => ({ ...prev, [type]: uploadedFiles[0] }));
    } else {
      setFiles(prev => ({ 
        ...prev, 
        [type]: [...prev[type], ...Array.from(uploadedFiles)]
      }));
    }
    setDragActive(prev => ({ ...prev, [type]: false }));
  };

  const removeFile = (type, index) => {
    if (type === 'resume') {
      setFiles(prev => ({ ...prev, resume: null }));
    } else {
      setFiles(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const FileUploadSection = ({ type, multiple, title }) => (
    <div 
      className={`${styles.uploadSection} ${dragActive[type] ? styles.dragActive : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(prev => ({ ...prev, [type]: true }));
      }}
      onDragLeave={() => setDragActive(prev => ({ ...prev, [type]: false }))}
      onDrop={(e) => {
        handleFileUpload(type, e);
      }}
      onClick={() => fileInputRefs[type].current?.click()}
    >
      <FaCloudUploadAlt className={styles.uploadIcon} />
      <p className={styles.uploadText}>
        Drag and drop or click to upload {title}
      </p>
      <input
        ref={fileInputRefs[type]}
        type="file"
        style={{ display: 'none' }} // Make sure this is hidden appropriately
        multiple={multiple}
        onChange={(e) => handleFileUpload(type, e)}
      />
      {files[type] && (type === 'resume' ? (
        <div className={styles.fileList}>
          <div className={styles.fileItem}>
            <span className={styles.fileName}>{files[type].name}</span>
            <button onClick={() => removeFile(type)} className={styles.removeFileButton}>
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.fileList}>
          {files[type].map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span className={styles.fileName}>{file.name}</span>
              <button onClick={() => removeFile(type, index)} className={styles.removeFileButton}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  

  const navigate = useNavigate();
  const token = Cookies.get("token");
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("jobtitle", formData.jobTitle);
    formData.expertise.forEach((exp, index) => form.append(`expertise[${index}]`, exp));
    formData.links.forEach((link, index) => {
      form.append(`links[${index}][urlname]`, link.title);
      form.append(`links[${index}][url]`, link.url);
    });

    if (files.resume) form.append("resume", files.resume);
    files.proof.forEach((file, index) => form.append(`proof[${index}]`, file));
    files.library.forEach((file, index) => form.append(`library[${index}]`, file));

    try {
      const response = await fetch('http://localhost:8080/signup/expert', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include token if required
        },
        body: form
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Submission successful', data);
        setShowSuccessPopup(true); // Show the success popup
      } else {
        console.error('Submission failed', await response.json());
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create Expert Profile</h2>
      
      <form className={styles.formGrid}>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              className={styles.input}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Job Title</label>
            <input
              type="text"
              className={styles.input}
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Expertise (Press Enter or comma to add)</label>
            <input
              type="text"
              className={styles.input}
              onKeyDown={handleExpertiseInput}
            />
            <div className={styles.expertiseContainer}>
              {formData.expertise.map((tag, index) => (
                <span key={index} className={styles.expertiseTag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newExpertise = formData.expertise.filter((_, i) => i !== index);
                      handleInputChange('expertise', newExpertise);
                    }}
                    className={styles.removeTagButton}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Links</label>
            <div className={styles.linksContainer}>
              <TransitionGroup>
                {formData.links.map((link, index) => (
                  <CSSTransition
                    key={index}
                    timeout={300}
                    classNames={{
                      enter: styles.fadeEnter,
                      enterActive: styles.fadeEnterActive,
                      exit: styles.fadeExit,
                      exitActive: styles.fadeExitActive
                    }}
                  >
                    <div className={styles.linkGroup}>
                      <input
                        type="text"
                        placeholder="Title"
                        className={styles.input}
                        value={link.title}
                        onChange={(e) => {
                          const newLinks = [...formData.links];
                          newLinks[index].title = e.target.value;
                          handleInputChange('links', newLinks);
                        }}
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        className={styles.input}
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...formData.links];
                          newLinks[index].url = e.target.value;
                          handleInputChange('links', newLinks);
                        }}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newLinks = formData.links.filter((_, i) => i !== index);
                            handleInputChange('links', newLinks);
                          }}
                          className={styles.removeTagButton}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
              <button
                type="button"
                onClick={() => {
                  const newLinks = [...formData.links, { title: '', url: '' }];
                  handleInputChange('links', newLinks);
                }}
                className={styles.addLinkButton}
              >
                <FaPlus /> Add Link
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <FileUploadSection type="resume" multiple={false} title="your resume" />
          <FileUploadSection type="proof" multiple={true} title="proof documents" />
          <FileUploadSection type="library" multiple={true} title="library files" />
        </div>

        <button type="submit" className={styles.submitButton} onClick={(e) => handleSubmit(e)}>
          Create Profile
        </button>
      </form>
      
      {showSuccessPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} />}
    </div>
  );
}