import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GridItem from './components/GridItem';

import soundImg from './images/sound.png';
import houseImg from './images/house.png';
import graphImg from './images/graph.png';
import mapImg from './images/map.png';

import { Link } from "react-router-dom";


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
        <div className="grid">
          <GridItem src={soundImg} alt="실시간 소음 측정" text="실시간 소음 측정" />
          <Link to="/Cyclesound">
            <GridItem src={houseImg} alt="내 공간 소음 측정" text="내 공간 소음 측정" />
          </Link>
          <GridItem src={graphImg} alt="측정 그래프 보기" text="측정 그래프 보기" />
          <GridItem src={mapImg} alt="소음 지도" text="소음 지도" />
        </div>
      </main>
    </div>
  );
};

export default App;
