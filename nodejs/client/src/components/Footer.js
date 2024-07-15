import React from 'react';
import './Footer.css';
import { Link } from "react-router-dom";

import homeIcon from '../images/home.png';
import mapIcon from '../images/map.png';
import settingIcon from '../images/setting.png';

const Footer = () => {
  return (
    <footer>
      <Link to="/">
        <img src={homeIcon} alt="Home" />
        <p>HOME</p>
      </Link>
      <Link to="/SoundMap">
        <img src={mapIcon} alt="Map" />
        <p>MAP</p>
      </Link>
      <Link to="/Setting">
        <img src={settingIcon} alt="Setting" />
        <p>SETTING</p>
      </Link>
    </footer>
  );
};

export default Footer;
