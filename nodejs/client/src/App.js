import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { Link } from "react-router-dom";
import axios from 'axios';

import conversationIcon from './images/conversation.png';
import livesoundIcon from './images/livesound.png';
import megaphone from './images/megaphone.png';

const REACT_APP_FASTAPI = process.env.REACT_APP_FASTAPI;

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchNoticeTitle = async () => {
      try {
        const response = await axios.get(`${REACT_APP_FASTAPI}/noticeFirst`);
        setNoticeTitle(response.data.title);
      } catch (error) {
        console.error('Error fetching notice title:', error);
      }
    };

    fetchNoticeTitle();
  }, []);
  
  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
        <Link to="/NoticeList">
          <div className="notification">
            <img src={megaphone} alt="Megaphone" />
            <div className="notification-text">
              {noticeTitle}
            </div>
          </div>
        </Link>
        <div className="scroll-container">
          <Link to="/Livesound">
            <div className="scroll-button">
              <img src={livesoundIcon} alt="실시간 소음 분석" />
              <p>실시간 소음 분석</p>
            </div>
          </Link>
          <Link to="/Conversation">
            <div className="scroll-button">
              <img src={conversationIcon} alt="대화 감정 분석" />
              <p>대화 감정 분석</p>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
