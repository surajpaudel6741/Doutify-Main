import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./Initial.module.css";
import TimeMoneyDurationModal from "./TimeMoneyDurationModal";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import {  useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ExpertProfileModal from "./ExpertProfileModal";
import {  useSwitchExpertContext } from "../context/switchExpertContext";


const Initial = () => {
  const [saveState, setSaveState] = useState(false);
  const [doubt, setDoubt] = useState("");
  const [fieldInput, setFieldInput] = useState("");
  const [fieldTags, setFieldTags] = useState([]);
  const [minMoney, setMinMoney] = useState(0);
  const [maxMoney, setMaxMoney] = useState(100);
  const [duration, setDuration] = useState(1);
  const [doubtPictures, setDoubtPictures] = useState([]);
  const [doubtDescription, setDoubtDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const quillRef = useRef();
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const {state,setState} = useSwitchExpertContext()

  console.log("Redirected to the initial")
   
  


  // useEffect(() => {

  //   if (!verify()) {
  //     navigate("/login", { replace: true });
  //   }
  // }, [navigate]);

  const extractDataFromQuill = () => {
    const quillEditor = quillRef.current.getEditor();
    const delta = quillEditor.getContents();
    const textParts = [];
    const images = [];

    delta.ops.forEach((op) => {
      if (op.insert && typeof op.insert === "string") {
        textParts.push(op.insert);
      } else if (op.insert && op.insert.image) {
        images.push(op.insert.image);
      }
    });

    return { textParts, images };
  };

  const handleFieldInputChange = (e) => {
    const value = e.target.value;
    setFieldInput(value);

    if (value.endsWith(',')) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !fieldTags.includes(newTag)) {
        setFieldTags([...fieldTags, newTag]);
      }
      setFieldInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFieldTags(fieldTags.filter(tag => tag !== tagToRemove));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.size <= 2 * 1024 * 1024 && file.type.startsWith("image/") // Check for file size and type
    );

    if (validFiles.length < droppedFiles.length) {
      alert("Some files were not added because they exceed the 2 MB limit or are not images.");
    }

    setDoubtPictures((prevPictures) => [...prevPictures, ...validFiles]);
    setIsDragging(false);
  };
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => 
      file.size <= 2 * 1024 * 1024 && file.type.startsWith("image/") // Check for file size and type
    );

    if (validFiles.length < selectedFiles.length) {
      alert("Some files were not added because they exceed the 2 MB limit or are not images.");
    }

    setDoubtPictures((prevPictures) => [...prevPictures, ...validFiles]);
  };

  const handleRemoveImage = (index) => {
    setDoubtPictures((prevPictures) => 
      prevPictures.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    if (!doubt || !doubtDescription || fieldTags.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const { textParts, images } = extractDataFromQuill();
    const formData = new FormData();
    formData.append("doubt", doubt);
    formData.append("doubtDescription", doubtDescription);
    formData.append("field", JSON.stringify(fieldTags));
    formData.append("minMoney", minMoney);
    formData.append("maxMoney", maxMoney);
    formData.append("duration", duration);

    images.forEach((image, index) =>
      formData.append(`doubtImage${index + 1}`, image)
    );

    doubtPictures.forEach((file) => {
      formData.append("doubtPictures", file);
    });

    const token = Cookies.get("token");
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/doubt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

     
      if (response.ok) {
        alert("Doubt submitted successfully!");
        setShowModal(false)
        setDoubt("");
      setDoubtDescription("");
      setFieldInput("");
      setFieldTags([]);
      setMinMoney(0);
      setMaxMoney(100);
      setDuration(1);
      setDoubtPictures([]);
      if (quillRef.current) {
        quillRef.current.getEditor().setContents([]);
      }
      } else {
        console.log("Error occured")
        // console.error("Error submitting doubt:", data.message);
        alert("An error occurred while submitting your doubt.");
      }
    } catch (error) {
      console.log(error)
      // console.error("Error submitting doubt:", error);
      alert("An error occurred while submitting your doubt.");
    }
  };

  const handleIDoubtClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className={styles.askQuestionContainer}>
      <h2 className={styles.heading}>Ask a Question</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.questionInput}
            placeholder="What's your question?"
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Field of doubt</label>
          <div className={styles.tagInputContainer}>
            <div className={styles.tagList}>
              {fieldTags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              className={styles.questionInput}
              placeholder="Enter fields (comma-separated)"
              value={fieldInput}
              onChange={handleFieldInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Describe your Problem!</label>
          <ReactQuill
            theme="snow"
            value={doubtDescription}
            onChange={setDoubtDescription}
            ref={quillRef}
            className={styles.descriptionEditor}
            placeholder="Explain your doubts here!"
          />
        </div>

        <div className={styles.formGroup}>
      <label className={styles.label}>Upload Additional Doubt Pictures</label>
      <div
        className={`${styles.dragDrop} ${isDragging ? styles.dragging : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <FaCloudUploadAlt size={50} />
        <p>Drag & drop files or click to select files</p>
      </div>

      {/* Thumbnail Preview */}
      <div className={styles.previewContainer}>
        {doubtPictures.map((file, index) => (
          <div key={index} className={styles.thumbnail}>
            <img
              src={URL.createObjectURL(file)}
              alt={`thumbnail-${index}`}
              className={styles.image}
            />
            <button
              className={styles.removeButton}
              onClick={() => handleRemoveImage(index)}
            >
              <span><FaTimes /></span>
            </button>
          </div>
        ))}
      </div>
    </div>

        <button type="button" className={styles.submitBtn} onClick={handleIDoubtClick}>
          I Doubt
        </button>
      </form>

      {showModal && (
        <TimeMoneyDurationModal
          minMoney={minMoney}
          maxMoney={maxMoney}
          duration={duration}
          setMinMoney={setMinMoney}
          setMaxMoney={setMaxMoney}
          setDuration={setDuration}
          closeModal={closeModal}
          submitModal={handleSubmit}
        />
      )}
      {state && <ExpertProfileModal state={setSaveState} />}
    </div>
  );
};

export default Initial;
