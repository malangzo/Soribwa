import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { Link } from "react-router-dom";

import conversationIcon from './images/conversation.png';
import livesoundIcon from './images/livesound.png';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
        <div className="notification">
          공지사항 업데이트 버전...
        </div>
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
