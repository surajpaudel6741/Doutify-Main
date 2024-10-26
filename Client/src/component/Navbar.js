import React, { useContext, useEffect, useState } from 'react';
import navcss from './Navbar.module.css';
import Profiledropdown from './Profiledropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import ExpertProfileModal from './ExpertProfileModal'; // Import the modal component
import {  useSwitchExpertContext } from '../context/switchExpertContext';

export default function Navbar({setModalOpen}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpert, setIsExpert] = useState(false);
  const [showSwitch, setShowSwitch] = useState(true);
  const {state, setState} = useSwitchExpertContext()

   

  useEffect(() => {
    // setIsExpert(location.pathname === '/expert');
    setShowSwitch(!['/login', '/signup'].includes(location.pathname));
  }, [location.pathname]);

  const handleToggle = async  () => {
    try {
      const token =await Cookies.get('token');
      console.log("Token is")
      console.log(token)
    
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }


      const response =  fetch("http://localhost:8080/request/expertexists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response)=>response.json())
      .catch((error)=>console.log(error))
      .then((data)=>{
        console.log(data)
        if (data){
          console.log("data is",data)
          Cookies.set("token",data.token)
          navigate("/expert");
          //
        }else{
          console.log("data is",data)
          setState(true)
          // navigate("/initial",{state : true})
        }
      })
    }

    catch(err){
      console.log(err);
    }
  };

  

  return (
    <div className="shadow-sm">
      <nav className="shadow-sm navbar d-block navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid d-flex justify-content-between">
          <ul className="navbar-nav">
            {showSwitch && (
              <li className="nav-item">
                {/* <button className="btn btn-outline-success fw-bold" onClick={handleToggle}> */}
                <button className="btn btn-outline-success fw-bold" onClick={()=>handleToggle()}>
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
      
      {/* Render the modal */}

      
    </div>
  );
}
