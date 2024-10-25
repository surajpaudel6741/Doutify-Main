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
    setIsExpert(location.pathname === '/expert');
    setShowSwitch(!['/login', '/signup'].includes(location.pathname));
  }, [location.pathname]);

  useEffect(()=>{
    const token = Cookies.get('token');
    
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

 

    // try {
    //   const response =  fetch("http://localhost:8080/request/expertexists", {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }).then((response)=>response.json())
    //   .catch((error)=>console.log(error))
    //   .then((data)=>{
    //        if (isExpert){
    //         navigate('/initial');
    //        }


    //         })




      // const exists =  response.json();
      // if (!response.ok) {
      //   console.log(response)
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // if (response.ok) {
      //   if (isExpert) {
      //     // Switch to User page
      //     navigate('/initial');
      //   } else {
      //     setModalOpen(true);
      //     // if (exists) {
      //     //   // User has an expert profile, navigate to expert page
      //     //   navigate('/expert');
      //     // } else {
      //     //   // No expert profile exists, open the modal
            
      //     // }
      //   }
    //   } else {
    //     alert("Error checking expert profile.");
    //   }
    // } catch (error) {
    //   console.error("Error checking expert profile:", error);
    //   alert("An error occurred while checking your profile.");
    // }
  },[])

  const handleToggle = async  () => {
    try {
      const token =await Cookies.get('token');
    
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
        if (data){
          navigate("/expert");
        }else{
          setState(true)
          navigate("/initial",{state : true})
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
      
      {/* Render the modal */}

      
    </div>
  );
}
