import React, { useState } from 'react';
import ExpertProfile from './ExpertProfile';
import './styles.css'; // Import CSS for styles
import { Navigate } from 'react-router-dom';

const BidPopup = ({ doubt, onClose }) => {
  const [selectedExpert, setSelectedExpert] = useState(null);

  const handleExpertClick = (expert) => {
    Navigate("/expert/:id")
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString(); // Format to locale string
  };

  return (
    <div className="overlay">
      <div className="popup-container">
        <h3>{`Bids for: ${doubt.title}`}</h3>
        <div className="bid-card-container">
          {doubt.bids.map((bid) => (
            <div key={bid.expert.id} className="bid-card">
              <img src={bid.expert.picture} alt={bid.expert.name} className="expert-image" />
              <div className="card-content">
                <h4 className="expert-name">{bid.expert.name}</h4>
                <p className="bid-amount">Bid: ${bid.amount}</p>
                <p className="meeting-date">Meeting on: {formatDateTime(bid.meetingDate)}</p>
                <div className="card-buttons">
                  <button className="select-expert-button" onClick={() => alert(`Expert ${bid.expert.name} selected!`)}>
                    Select Expert
                  </button>
                  <button className="view-profile-button" onClick={() => handleExpertClick(bid.expert)}>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
        {selectedExpert && <ExpertProfile expert={selectedExpert} onClose={() => setSelectedExpert(null)} />}
      </div>
    </div>
  );
};

export default BidPopup;
