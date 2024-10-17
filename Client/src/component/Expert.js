import React, { useState, useEffect } from "react";
import styles from "./Expert.module.css";
import { FaMoneyBillWave } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const Expert = () => {
  const [doubts, setDoubts] = useState([]);
  const [bids, setBids] = useState({}); // Stores bids for each doubt
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [activeDoubt, setActiveDoubt] = useState(null); // Track which doubt the bid is for
  const [bidAmount, setBidAmount] = useState(""); // Track bid amount

  useEffect(() => {
    fetch("http://localhost:4000/api/getDoubts")
      .then((response) => response.json())
      .then((data) => setDoubts(data))
      .catch((error) => console.error("Error fetching doubts:", error));
  }, []);

  const handleBidClick = (index) => {
    setActiveDoubt(index); // Track which doubt is being bid on
    setModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setBidAmount(""); // Clear the bid input
  };

  const submitBid = () => {
    console.log(`Submitting bid of ${bidAmount} USD for doubt ${activeDoubt + 1}`);

    fetch('http://localhost:4000/api/submitBid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doubtId: activeDoubt + 1, bidAmount }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Bid submitted:", data);
        alert(`Bid submitted successfully: ${bidAmount} USD`);

        // Remove the doubt from the feed by filtering it out
        setDoubts((prevDoubts) => prevDoubts.filter((_, index) => index !== activeDoubt));

        // Close the modal after submission
        handleModalClose();
      })
      .catch((error) => console.error("Error submitting bid:", error));
  };

  return (
    <div className={styles.doubtContainer}>
      {doubts.map((doubt, index) => (
        <div key={index} className={styles.doubtBox}>
          <div className={styles.doubtHeader}>
            <div className={styles.userInfo}>
              <img
                src={doubt.userIcon}
                alt="User Icon"
                className={styles.userIcon}
              />
              <span className={styles.userName}>{doubt.userName}</span>
            </div>
            <span className={styles.doubtTime}>{doubt.time}</span>
          </div>
          <h3 className={styles.doubtTitle}>{doubt.title}</h3>
          <p className={styles.doubtDescription}>{doubt.description}</p>

          {doubt.images && doubt.images.length > 0 && (
            <div className={styles.imageContainer}>
              {doubt.images.length === 1 ? (
                <img
                  src={doubt.images[0]}
                  alt="Doubt image"
                  className={styles.doubtImage}
                />
              ) : (
                <Swiper className={styles.imageSlider}>
                  {doubt.images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                          src={doubt.images[0]}
                          alt={`Slide image ${index}`} // Remove redundant "image" wording
                          className={styles.doubtImage}
                        />
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
            <button
              className={styles.bidButton}
              onClick={() => handleBidClick(index)}
            >
              Place Bid
            </button>
            {/* Show the bid if submitted */}
            {bids[index] && <p>Your Bid: {bids[index]} USD</p>}
          </div>
        </div>
      ))}

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
