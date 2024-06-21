import React, { useState } from 'react';
import './Cycle.css';
import Sidebar from './components/Sidebar';
import sideBar from './images/sideBar.png';
import backIcon from './images/backIcon.png';
import startIcon from './images/startIcon.png';
import stopIcon from './images/stopIcon.png';


const Cyclesound = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <header className="header">
                <button className="menu-button" onClick={toggleSidebar}>
                    <img src={sideBar} alt="Menu" />
                </button>
                <h1>소리봐</h1>
                <button className="back-button">
                    <img src={backIcon} alt="Back" />
                </button>
                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            </header>
            
            <main>
            <div className="circle">
                <button className="play-button" onClick={togglePlayPause}>
                <img src={isPlaying ? stopIcon : startIcon} alt="Play/Pause" />
                </button>
            </div>
            </main>
        </div>
    );
};
export default Cyclesound;
