import React from 'react';
import './Header.css';
import sideBar from '../images/sideBar.png';
import backIcon from '../images/backIcon.png';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="menu-button" onClick={toggleSidebar}>
        <img src={sideBar} alt="Menu" />
      </button>
      <h1>소리봐</h1>
      <button className="back-button">
        <img src={backIcon} alt="Menu" />
      </button>
    </header>
  );
};

export default Header;
