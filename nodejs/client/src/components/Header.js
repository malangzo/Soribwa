import React, { useState, useEffect } from 'react';
import './Header.css';
import sidebarIcon from '../images/main_left.png';
import backIcon from '../images/back.png';
import soribwa from '../images/soribwa.png';
import { useNavigate, useLocation } from "react-router-dom";

<link rel="manifest" href="/manifest.json" />

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidPath, setIsValidPath] = useState(true);

  useEffect(() => {
    const checkValidPath = async () => {
      try {
        const response = await fetch(`${location.path}`);
        if (response.ok) {
          setIsValidPath(true);
        } else {
          setIsValidPath(false);
        }
      } catch (error) {
        setIsValidPath(false);
        console.error('Error checking valid path:', error);
      }
    };

    checkValidPath();
  }, [location.path]);

  useEffect(() => {
    if (!isValidPath) {
      navigate('/NoticeList');
    }
  }, [isValidPath, navigate]);

    const handleBackButtonClick = () => {
      if (location.pathname !== '/App') {
        if (isValidPath) {
          navigate(-1);
        } else { 
          navigate('/App');
      }
    }
  };

  return (
    <header className="header">
      <div className="menu-logo">
        <button className="menu-button" onClick={toggleSidebar}>
          <img src={sidebarIcon} alt="Menu" />
        </button>
        <img src={soribwa} alt="Soribwa" className="soribwa-logo" />
      </div>
        <button className="back-button" onClick={handleBackButtonClick}>
          <img src={backIcon} alt="Back" />
        </button>
    </header>
  );
};

export default Header;
