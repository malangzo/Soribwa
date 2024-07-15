import React, { useState } from 'react';
import './Sidebar.css';
import back_whiteIcon from '../images/back_white.png';
import conversation_sidebarIcon from '../images/conversation_sidebar.png';
import livesound_sidebarIcon from '../images/livesound_sidebar.png';
import setting_sidebarIcon from '../images/setting_sidebar.png';
import data_sidebarIcon from '../images/data_sidebar.png';
import map_sidebarIcon from '../images/map_sidebar.png';
import userAvatarDefault from '../images/userAvatar.png'; 

//import { Link } from "react-router-dom";


const Sidebar = ({ isOpen, onClose }) => {
    const [userAvatar, setUserAvatar] = useState(sessionStorage.getItem("img") ? sessionStorage.getItem("img"):userAvatarDefault);
    const [userName, setUserName] = useState(sessionStorage.getItem("name") ? sessionStorage.getItem("name"):"Undefined");

    const handleBackButtonClick = () => {
        onClose();
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <button className="back-button-white" onClick={handleBackButtonClick}>
                    <img src={back_whiteIcon} alt="Menu" />
                </button>
                <div className="user-info">
                    <img src={userAvatar} alt="UserAvatar" />
                    <p>{userName} 님,<br />안녕하세요!</p>
                </div>
            </div>

            <nav>
                <ul>
                    <li>
                        <a href="/Livesound">
                            <img src={livesound_sidebarIcon} alt="실시간 소음 분석" />
                            실시간 소음 분석
                        </a>
                    </li>
                    <li>
                        <a href="/Conversation">
                            <img src={conversation_sidebarIcon} alt="대화 감정 분석" />
                            대화 감정 분석
                        </a>
                    </li>
                    <li className="spacer"></li>
                    <li>
                        <a href="/SoundMap">
                            <img src={map_sidebarIcon} alt="소음 지도" />
                            소음 지도
                        </a>
                    </li>
                    <li>
                        <a href="/Graph">
                            <img src={data_sidebarIcon} alt="내 데이터" />
                            내 데이터
                        </a>
                    </li>
                    <li className="spacer"></li>
                    <li>
                        <a href="/Setting">
                            <img src={setting_sidebarIcon} alt="설정" />
                            설정
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
