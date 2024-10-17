import React, { useEffect, useState } from 'react';
import navcss from './Navbar.module.css';
import Profiledropdown from './Profiledropdown';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpert, setIsExpert] = useState(false);
  const [showSwitch, setShowSwitch] = useState(true);

  useEffect(() => {
    setIsExpert(location.pathname === '/expert');
    setShowSwitch(!['/login', '/signup'].includes(location.pathname));
  }, [location.pathname]);

  const handleToggle = () => {
    const newPath = isExpert ? '/initial' : '/expert';
    navigate(newPath);
  };

  return (
    <div className="shadow-sm">
      <nav className="shadow-sm navbar d-block navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid d-flex justify-content-between">
          <ul className="navbar-nav">
            {showSwitch && (
              <li className="nav-item">
                <button className="btn btn-outline-success fw-bold" onClick={handleToggle}>
                  {isExpert ? 'Switch to User' : 'Switch to Expert'}
                </button>
              </li>
            )}
          </ul>
          <div className="d-block">
            <a className={`navbar-brand doubtify-logo ${navcss['doubtify-logo']}`} href="/">
              Doubtify
            </a>
          </div>
          {showSwitch && <Profiledropdown />}
        </div>
      </nav>
    </div>
  );
}