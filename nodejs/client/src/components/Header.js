import React from 'react';
import './Header.css';
import sidebarIcon from '../images/main_left.png';
import backIcon from '../images/back.png';
import soribwa from '../images/soribwa.png';
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <div className="menu-logo">
        <button className="menu-button" onClick={toggleSidebar}>
          <img src={sidebarIcon} alt="Menu" />
        </button>
        <img src={soribwa} alt="Soribwa" className="soribwa-logo" />
      </div>
      <Link to="/App">
        <button className="back-button">
          <img src={backIcon} alt="Back" />
        </button>
      </Link>
    </header>
  );
};

export default Header;
