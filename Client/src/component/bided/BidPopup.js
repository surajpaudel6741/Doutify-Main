import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertProfile from './ExpertProfile';
import './styles.css';

const BidPopup = ({ doubt, onClose, doubtid ,setSelectedDoubt }) => {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const navigate = useNavigate();

  const handleExpertClick = (expert) => {
    navigate(`/expert/${expert.id}`);
  };

  const handleSelectExpert = (bid) => {
    // Generate a unique room ID using the expert and student information
    const roomID = `room_${bid.expertname}_${Date.now()}`;
    // Navigate to the video room with the room ID
    navigate(`/video-room/${roomID}`, {
      state: {
        expertName: bid.expertname,
        meetingDate: bid.meetingDate,
        price: bid.finalPrice,
        roomID: roomID
      }
    });
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="overlay">
      <div className="popup-container">
        <div className="bid-card-container scrollable">
          {doubt.map((bid) => (
            bid.doubtId === doubtid && (
              <div key={bid.expertname} className="bid-card">
                {/* <img src={bid.expertImage} alt={bid.expertname} className="expert-image" /> */}
                <div className="card-content">
                  <h4 className="expert-name">{bid.expertname}</h4>
                  <p className="bid-amount">Bid: ${bid.finalPrice}</p>
                  {/* <p className="meeting-date">Meeting on: {formatDateTime(bid.meetingDate)}</p> */}
                  <div className="card-buttons">
                    <button
                      className="select-expert-button"
                      onClick={() => handleSelectExpert(bid)}
                    >
                      Join Video Call
                    </button>
                    {/* <button
                      className="view-profile-button"
                      onClick={() => handleExpertClick(bid.expert)}
                    >
                      View Profile
                    </button> */}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
        {selectedExpert && <ExpertProfile expert={selectedExpert} onClose={() => setSelectedExpert(null)} />}
      </div>
    </div>
  );
};

export default BidPopup;
