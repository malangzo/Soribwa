import React from 'react';
import './Sidebar.css';
import soundIcon from '../images/sound.png';
import houseIcon from '../images/house.png';
import graphIcon from '../images/graph.png';
import mapIcon from '../images/map.png';
import settingsIcon from '../images/etc.png';
import backIcon from '../images/backIcon_black.png';
import userAvatar from '../images/userAvatar.jpg';

//import { Link } from "react-router-dom";

const Livesound = process.env.REACT_APP_JAEHYUCK;
const Soundmap = process.env.REACT_APP_YUJUNG;
const Sidebar = ({ isOpen, onClose }) => {
    const username = '유지민'; // 사용자 이름

    const handleBackButtonClick = () => {
        onClose();
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <button className="back-button-black" onClick={handleBackButtonClick}>
                    <img src={backIcon} alt="Menu" />
                </button>
                <div className="user-info">
                    <img src={userAvatar} alt="UserAvatar" />
                    <p>{username} 님,<br />안녕하세요!</p>
                </div>
            </div>

            <nav>
                <ul>
                    <li>
                        <a href={Livesound} rel="noopener noreferrer">
                            <img src={soundIcon} alt="실시간 소음 측정" />
                            실시간 소음 측정
                        </a>
                    </li>
                    <li>
                        <a href="/Cyclesound">
                            <img src={houseIcon} alt="내 공간 소음 측정" />
                            내 공간 소음 측정
                        </a>
                    </li>
                    <li>
                        <a href="/Graph">
                            <img src={graphIcon} alt="측정 그래프 보기" />
                            측정 그래프 보기
                        </a>
                    </li>
                    <li>
                        <a href={Soundmap} rel="noopener noreferrer">
                            <img src={mapIcon} alt="소음 지도" />
                            소음 지도
                        </a>
                    </li>
                    <li className="spacer"></li>
                    <li>
                        <a href="#">
                            <img src={settingsIcon} alt="설정" />
                            설정
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;


