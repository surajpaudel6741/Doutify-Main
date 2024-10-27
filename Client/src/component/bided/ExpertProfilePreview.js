import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import CSS for styles

const ExpertProfilePreview = ({ expert }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/experts/${expert.id}`);
  };

  const handleSelectExpert = () => {
    // Logic for selecting the expert (e.g., storing in state, sending to backend, etc.)
    alert(`Expert ${expert.name} selected!`);
  };

  return (
    <div className="profile-preview">
      <img src={expert.picture} alt={expert.name} className="expert-image" />
      <h3 className="expert-name">{expert.name}</h3>
      <p className="expert-title">{expert.title}</p>
      <button className="select-expert-button" onClick={handleSelectExpert}>
        Select Expert
      </button>
      <button className="view-profile-button" onClick={handleProfileClick}>
        View Full Profile
      </button>
    </div>
  );
};

export default ExpertProfilePreview;
