import React, { useState } from "react";
import styles from "./ExpertSignup.module.css";
import { FiFileText } from "react-icons/fi";
import Cookies from "js-cookie";

const ExpertSignup = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [links, setLinks] = useState("");
  const [resume, setResume] = useState(null);
  const [proof, setProof] = useState([]);
  const [library, setLibrary] = useState([]);

  const handleFileChange = (e, setter) => {
    setter(Array.from(e.target.files));
  };

  const handleExpertiseChange = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const value = e.target.value.trim().replace(/,$/, "");
      if (value && !expertise.includes(value)) {
        setExpertise([...expertise, value]);
      }
      e.target.value = "";
    }
  };

  const handleRemoveExpertise = (tag) => {
    setExpertise(expertise.filter((item) => item !== tag));
  };

  const handleDrop = (e, setter) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setter(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("jobtitle", jobTitle);
    expertise.forEach((exp) => formData.append("expertese", exp));
    links.split(",").forEach((link) => formData.append("links", link.trim()));
    if (resume) formData.append("resume", resume);
    proof.forEach((file) => formData.append("proof", file));
    library.forEach((file) => formData.append("library", file));

    const token = Cookies.get("token");
    try {
      const response = await fetch("http://localhost:8080/api/expsignup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Expert profile created successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting expert profile:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create Expert Profile</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Describe your expertise"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Job Title</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Expertise</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Type and press Enter or comma"
            onKeyDown={handleExpertiseChange}
          />
          <div className={styles.tagContainer}>
            {expertise.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  className={styles.removeTagButton}
                  onClick={() => handleRemoveExpertise(tag)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Links</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter links (comma-separated)"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />
        </div>

        <div
          className={styles.dragDropArea}
          onDrop={(e) => handleDrop(e, setResume)}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className={styles.label}>Resume</label>
          <input
            type="file"
            className={styles.fileInput}
            accept=".pdf, .doc, .docx"
            onChange={(e) => setResume(e.target.files[0])}
            hidden
          />
          <p>Drag and drop your resume here, or click to upload</p>
          {resume && (
            <div className={styles.filePreview}>
              <FiFileText className={styles.fileIcon} /> {resume.name}
            </div>
          )}
        </div>

        <div
          className={styles.dragDropArea}
          onDrop={(e) => handleDrop(e, setProof)}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className={styles.label}>Proof of Expertise</label>
          <input
            type="file"
            className={styles.fileInput}
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, setProof)}
            hidden
          />
          <p>Drag and drop your files here, or click to upload</p>
        </div>

        <div
          className={styles.dragDropArea}
          onDrop={(e) => handleDrop(e, setLibrary)}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className={styles.label}>Library</label>
          <input
            type="file"
            className={styles.fileInput}
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, setLibrary)}
            hidden
          />
          <p>Drag and drop your images here, or click to upload</p>
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default ExpertSignup;
