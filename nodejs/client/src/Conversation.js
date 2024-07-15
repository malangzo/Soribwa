// CycleResult.js
import React, { useState, useEffect } from 'react';
import './App.css';
import './Cycle.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import startIcon from './images/start.png';
import stopIcon from './images/stop.png';

const Conversation = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <main>
                {/* <button className="play-button" onClick={isRecording ? () => stopRecording().catch(console.error) : startRecording}>
                    <img src={isRecording ? stopIcon : startIcon} alt={isRecording ? 'Stop' : 'Start'} />
                </button> */}
            </main>
            <Footer />
        </div>
    );
};

export default Conversation;
