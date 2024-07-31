import React, { useState, useEffect } from 'react';
import './Header.css';
import sidebarIcon from '../images/main_left.png';
import soribwa from '../images/soribwa.png';

<link rel="manifest" href="/manifest.json" />

const Header = ({ toggleSidebar }) => {

  return (
    <header className="header">
      <div className="menu-logo">
        <button className="menu-button" onClick={toggleSidebar}>
          <img src={sidebarIcon} alt="Menu" />
        </button>
        <img src={soribwa} alt="Soribwa" className="soribwa-logo" />
      </div>
    </header>
  );
};

export default Header;
