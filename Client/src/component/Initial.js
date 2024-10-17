import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./Initial.module.css";
import TimeMoneyDuration from "./TimeMoneyDuration";
import { FaCloudUploadAlt } from "react-icons/fa";
import { verify } from "../utils/tokenVerify";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Initial = () => {
  const [doubt, setDoubt] = useState("");
  const [field, setField] = useState("");
  const [minMoney, setMinMoney] = useState(0);
  const [maxMoney, setMaxMoney] = useState(100);
  const [duration, setDuration] = useState("");
  const [doubtPictures, setDoubtPictures] = useState([]);
  const [doubtDescription, setdoubtDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const quillRef = useRef();
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!verify()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

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

  const handleSubmit = async () => {
    const { textParts, images } = extractDataFromQuill();

    const formData = new FormData();
    formData.append("doubt", doubt);
    formData.append("doubtDescription", doubtDescription);
    formData.append("field", field);
    formData.append("minMoney", minMoney);
    formData.append("maxMoney", maxMoney);
    formData.append("duration", duration);
    images.forEach((image, index) =>
      formData.append(`doubtImage${index + 1}`, image)
    );

    doubtPictures.forEach((file, index) => {
      formData.append(`doubtPictures`, file);
    });

    const token = Cookies.get("token");
    if (!token) {
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

      const data = await response.json();
      if (response.ok) {
        alert("Doubt submitted successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting doubt:", error);
      alert("An error occurred while submitting your doubt.");
    }
  };

  const handleIDoubtClick = () => {
    setShowModal(true);
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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setDoubtPictures((prevFiles) => [...prevFiles, ...files]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDoubtPictures((prevFiles) => [...prevFiles, ...files]);
  };

  const handleModalSubmit = () => {
    setShowModal(false);
    handleSubmit();
  };

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
          <input
            type="text"
            className={styles.questionInput}
            placeholder="eg: data science"
            value={field}
            onChange={(e) => setField(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Describe your Problem!</label>
          <ReactQuill
            theme="snow"
            value={doubtDescription}
            onChange={setdoubtDescription}
            ref={quillRef}
            className={styles.descriptionEditor}
            placeholder="Explain your doubts here!"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Upload Additional Doubt Pictures
          </label>
          <div
            className={`${styles.dragDrop} ${
              isDragging ? styles.dragging : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
              ref={fileInputRef}
            />
            <FaCloudUploadAlt size={50} className={styles.uploadIcon} />
            <p>Drag & drop files or click to select files</p>
            {doubtPictures.length > 0 && (
              <p>{doubtPictures.length} file(s) selected</p>
            )}
          </div>
        </div>

        <button
          type="button"
          className={styles.submitBtn}
          onClick={handleIDoubtClick}
        >
          I Doubt
        </button>
      </form>

      {showModal && (
        <TimeMoneyDuration
          minMoney={minMoney}
          maxMoney={maxMoney}
          duration={duration}
          setMinMoney={setMinMoney}
          setMaxMoney={setMaxMoney}
          setDuration={setDuration}
          closeModal={() => setShowModal(false)}
          submitModal={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default Initial;
