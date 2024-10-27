import React, { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import styles from "./Expert.module.css";
import Cookies from "js-cookie";
import defaultUserIcon from "./abav.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import Slider from "react-slider"; // Import the slider component

const Expert = () => {
  const [doubts, setDoubts] = useState([]);
  const [bids, setBids] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // New confirmation modal state
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date()); // State for selected date and time

  // Fetch doubts data on component mount
  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/user/notifications",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const finaldata = JSON.parse(data[0].message);

        if (Array.isArray(data)) {
          const formattedDoubts = data.map((item) => ({
            userName: JSON.parse(item.message).user || "Unknown User",
            title: JSON.parse(item.message).doubt || "No title provided",
            description:
              JSON.parse(item.message).doubtDescription ||
              "No description provided",
            minMoney: JSON.parse(item.message).money?.min || "0",
            maxMoney: JSON.parse(item.message).money?.max || "0",
            duration: JSON.parse(item.message).duration,
            postday: JSON.parse(item.message).postday,
            _id: JSON.parse(item.message).doubtId,
            userIcon: JSON.parse(item.message).userIcon || defaultUserIcon,
            images: JSON.parse(item.message).doubtPictures || [],
          }));

          setDoubts(formattedDoubts);
        } else {
          console.error("No doubts found:", data);
        }
      } catch (error) {
        console.error("Error fetching doubts:", error);
      }
    };

    fetchDoubts();
  }, []);

  const handleBidClick = (index) => {
    setActiveDoubt(index);
    setBidAmount(doubts[index].minMoney); // Set initial bid amount to minMoney
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setBidAmount(0);
  };

  const submitBid = async () => {
    if (bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    const doubtId = doubts[activeDoubt]?._id;

    try {
      const response = await fetch(
        "http://localhost:8080/user/notification/finalTimenPrice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ doubtId, finalPrice: bidAmount, finalTime: selectedDateTime }), // Send selected dateTime with bid
        }
      );

      if (response.ok) {
        // Update bids and close the bid modal
        setBids((prevBids) => ({ ...prevBids, [activeDoubt]: bidAmount }));
        setDoubts((prevDoubts) =>
          prevDoubts.map((doubt, index) =>
            index === activeDoubt ? { ...doubt, bidPlaced: true } : doubt
          )
        );
        handleModalClose();
        
        // Open confirmation modal
        setConfirmationModalOpen(true);
      } else {
        console.error("Failed to submit bid:", response);
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  const handleConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
  };

  return (
    <div className={styles.doubtContainer}>
      {doubts.length > 0 ? (
        doubts.map((doubt, index) => (
          <div key={doubt._id} className={styles.doubtBox}>
            <div className={styles.doubtHeader}>
              <div className={styles.userInfo}>
                <img
                  src={doubt.userIcon}
                  alt="User Icon"
                  className={styles.userIcon}
                />
                <span className={styles.userName}>{doubt.userName}</span>
              </div>
              <span className={styles.doubtTime}>
                {doubt.postday || "Unknown date"}
                {" - " +
                  (doubt.postday
                    ? new Date(doubt.postday).toLocaleDateString()
                    : "N/A")}
              </span>
            </div>
            <h3 className={styles.doubtTitle}>{doubt.title}</h3>
            <p className={styles.doubtDescription}>{doubt.description}</p>

            {/* Image Slider */}
            {doubt.images && doubt.images.length > 0 && (
              <div className={styles.imageContainer}>
                {doubt.images.length === 1 ? (
                  <img
                    src={"http://localhost:8080/uploads/" + doubt.images[0]}
                    alt="Doubt"
                    className={styles.doubtImage}
                  />
                ) : (
                  <Swiper className={styles.imageSlider}>
                    {doubt.images.map((image, idx) => (
                      <SwiperSlide key={idx}>
                        <img
                          src={"http://localhost:8080/uploads/" + image}
                          alt={`Slide ${idx}`}
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
              {doubt.bidPlaced ? (
                <button className={styles.bidPlacedButton} disabled>
                  Bid Placed
                </button>
              ) : (
                <button
                  className={styles.bidButton}
                  onClick={() => handleBidClick(index)}
                >
                  Place Bid
                </button>
              )}
              {bids[index] && (
                <p className={styles.bidText}>Your Bid: {bids[index]} USD</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noDoubtsText}>No doubts available for bidding.</p>
      )}

      {/* Modal for Bidding */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Enter your bid</h3>
            <div className={styles.sliderContainer}>
              <Slider
                min={parseFloat(doubts[activeDoubt]?.minMoney)}
                max={parseFloat(doubts[activeDoubt]?.maxMoney)}
                value={bidAmount}
                onChange={(value) => setBidAmount(value)}
                className={styles.slider}
                thumbClassName={styles.thumb} // Add thumb styling
                trackClassName={styles.track} // Add track styling
              />
              <p>{bidAmount} USD</p>
            </div>
            <div>
              <label>Select Date and Time:</label>
              <DatePicker
                selected={selectedDateTime}
                onChange={(date) => setSelectedDateTime(date)}
                showTimeSelect
                dateFormat="Pp"
                className={styles.datePicker}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.submitButton} onClick={submitBid}>
                Submit Bid
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.confirmationModal}`}>
            <h3>Bid Placed Successfully!</h3>
            <p>{`Doubt: ${doubts[activeDoubt]?.title}`}</p>
            <p>{`Your Bid: ${bidAmount} USD`}</p>
            <p>Wait for the user’s response.</p>
            <button className={styles.okayButton} onClick={handleConfirmationModalClose}>
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expert;
