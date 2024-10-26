import React, { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import styles from "./Expert.module.css";

const Expert = () => {
  const [doubts, setDoubts] = useState([]);
  const [bids, setBids] = useState({}); // Stores bids for each doubt
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [activeDoubt, setActiveDoubt] = useState(null); // Track which doubt the bid is for
  const [bidAmount, setBidAmount] = useState(""); // Track bid amount

  // Fetch doubts data on component mount
  useEffect(() => {
    fetch("http://localhost:4000/api/getdoubts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDoubts(data);
        } else {
          console.error("No doubts found:", data);
        }
      })
      .catch((error) => console.error("Error fetching doubts:", error));
  }, []);

  // Open the bidding modal
  const handleBidClick = (index) => {
    setActiveDoubt(index);
    setModalOpen(true);
  };

  // Close the bidding modal
  const handleModalClose = () => {
    setModalOpen(false);
    setBidAmount("");
  };

  // Submit the bid for a specific doubt
  const submitBid = () => {
    const doubtId = doubts[activeDoubt]?._id;

    fetch("http://localhost:4000/api/submitbid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ doubtId, bidAmount }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Bid submitted:", data);
        alert(`Bid submitted successfully: ${bidAmount} USD`);

        setBids((prevBids) => ({ ...prevBids, [activeDoubt]: bidAmount }));
        setDoubts((prevDoubts) => prevDoubts.filter((_, index) => index !== activeDoubt));
        handleModalClose();
      })
      .catch((error) => console.error("Error submitting bid:", error));
  };

  return (
    <div className={styles.doubtContainer}>
      {doubts.length > 0 ? (
        doubts.map((doubt, index) => (
          <div key={index} className={styles.doubtBox}>
            <div className={styles.doubtHeader}>
              <div className={styles.userInfo}>
                <img src={doubt.userIcon} alt="User Icon" className={styles.userIcon} />
                <span className={styles.userName}>{doubt.userName}</span>
              </div>
              <span className={styles.doubtTime}>{doubt.time}</span>
            </div>
            <h3 className={styles.doubtTitle}>{doubt.title}</h3>
            <p className={styles.doubtDescription}>{doubt.description}</p>

            {/* Image Slider */}
            {doubt.images && doubt.images.length > 0 && (
              <div className={styles.imageContainer}>
                {doubt.images.length === 1 ? (
                  <img src={doubt.images[0]} alt="Doubt" className={styles.doubtImage} />
                ) : (
                  <Swiper className={styles.imageSlider}>
                    {doubt.images.map((image, idx) => (
                      <SwiperSlide key={idx}>
                        <img src={image} alt={`Slide ${idx}`} className={styles.doubtImage} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            )}

            <div className={styles.doubtFooter}>
              <div className={styles.moneyContainer}>
                <FaMoneyBillWave className={styles.moneyIcon} />
                <span className={styles.moneyText}>
                  {doubt.minMoney} USD - {doubt.maxMoney} USD
                </span>
              </div>
              <button className={styles.bidButton} onClick={() => handleBidClick(index)}>
                Place Bid
              </button>
              {bids[index] && <p className={styles.bidText}>Your Bid: {bids[index]} USD</p>}
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noDoubtsText}>No doubts available for bidding.</p>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Enter your bid</h3>
            <input
              type="number"
              className={styles.bidInput}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter amount in USD"
            />
            <div className={styles.modalActions}>
              <button className={styles.submitButton} onClick={submitBid}>
                Submit Bid
              </button>
              <button className={styles.cancelButton} onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expert;
