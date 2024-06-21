import React from 'react';
import './Header.css';
import sideBar from '../images/sideBar.png';
import backIcon from '../images/backIcon.png';
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="menu-button" onClick={toggleSidebar}>
        <img src={sideBar} alt="Menu" />
      </button>
      <h1>소리봐</h1>
      <Link to="/">
        <button className="back-button">
          <img src={backIcon} alt="Back" />
        </button>
      </Link>
    </header>
  );
};

export default Header;
