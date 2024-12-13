import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./component/Navbar";
import Expert from "./component/Expert";
import Initial from "./component/Initial";
import Login from "./component/Login";
import Signup from "./component/Signup";
import ExpertSignup from "./component/ExpertSignup";
import React, { useState, useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import ExpertProfileModal from "./component/ExpertProfileModal";
import SwitchExpertContext from "./context/switchExpertContext";
import Cookies from "js-cookie";
import DoubtList from "./component/bided/DoubtList"
import VideoRoom from "./component/VideoRoom";
function App() {
  console.log("App is rendered")
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navbarProp = location.pathname === "/initial" ? "User" : "Expert";
  const token =  Cookies.get("token");

  // useEffect(() => {
  //   console.log("login")
  //   const token = localStorage.getItem("token");
  //   setIsAuthenticated(!!token);
  // }, []);

  useEffect(() => {
    setLoading(true);
    ref.current.continuousStart();

    const timer = setTimeout(() => {
      setLoading(false);
      ref.current.complete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <SwitchExpertContext >
      <LoadingBar color="#f11946" ref={ref} />
      <div className="app-container">
        <div className="navbar-container">
          <Navbar navbarProp={navbarProp} setModalOpen ={setModalOpen} />
        </div>
        <div className="content-container">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route
                path="/initial"
                element={
                  token ? (
                    <Initial />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/expert"
                element={
                   token ? (
                    <Expert />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/video-room/:roomId" element={<VideoRoom />} />
              <Route
                path="/user/doubtlist"
                element={
                   token ? (
                    <DoubtList />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/"
                element={
                  token ? (
                    <Navigate to="/initial" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/expertsignup" element={<ExpertSignup></ExpertSignup>}></Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            
          )}
        </div>
      </div>
      {modalOpen&&
      <ExpertProfileModal/>}
      </SwitchExpertContext>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
