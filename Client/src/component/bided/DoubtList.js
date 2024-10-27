import React, { useState } from 'react';
import BidPopup from './BidPopup';
import './styles.css'; // Import CSS for styles

const DoubtList = ({ doubts }) => {
  const [selectedDoubt, setSelectedDoubt] = useState(null);

  const handleDoubtClick = (doubt) => {
    setSelectedDoubt(doubt);
  };

  const closePopup = () => {
    setSelectedDoubt(null);
  };

  return (
    <div className="doubt-list-container">
      <h2 className="header">Your Posted Doubts</h2>
      <ul className="doubt-list">
        {doubts.map((doubt) => (
          <li key={doubt.id} className="doubt-item" onClick={() => handleDoubtClick(doubt)}>
            {doubt.title} <span className="date-posted">({doubt.datePosted})</span>
          </li>
        ))}
      </ul>
      {selectedDoubt && <BidPopup doubt={selectedDoubt} onClose={closePopup} />}
    </div>
  );
};

export default DoubtList;
