import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie'; // Import Cookies for managing tokens
import css from './Profiledropdown.module.css';

export default function Profiledropdown(props) {
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleSignOut = () => {
    // Remove the token from localStorage and cookies
    localStorage.removeItem('token');
    Cookies.remove('token', { path: '/' });

    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div>
      <div className={css.profile} onClick={toggleMenu}>
        <div className={css.user}>
          <h5>{props.User_Name}</h5>
          <p>{props.username}</p>
        </div>
        <div className={css['img-box']}>
          <img 
            src="https://images.nightcafe.studio/jobs/xm4AsqDHyU5lSuUMCQIv/xm4AsqDHyU5lSuUMCQIv--1--r293g.jpg?tr=w-1600,c-at_max" 
            alt="User" 
          />
          <span className={css['icon-button__badge']}>2</span>
        </div>
      </div>
      <div className={`${css.menu} ${menuActive ? css.active : ''}`}>
        <ul>
          <li><a href="#"><i className="fa-solid fa-user"></i>&nbsp;Profile</a></li>
          <li><a href="#"><i className="fa-solid fa-message"></i>&nbsp;Inbox</a></li>
          <li><a href="#"><i className="fa-solid fa-gear"></i>&nbsp;Settings</a></li>
          <li><a href="#"><i className="fa-solid fa-circle-info"></i>&nbsp;Help</a></li>
          <li>
            <a href="#" onClick={handleSignOut}>
              <i className="fa-solid fa-right-from-bracket"></i>&nbsp;Sign Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

Profiledropdown.defaultProps = {
  User_Name: "Suraj Paudel",
  username: "@user"
};
