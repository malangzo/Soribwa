import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import { Link } from "react-router-dom";


const CycleResult = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
    <Header toggleSidebar={toggleSidebar} />
    <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
       
      </main>
    </div>
  );
};

export default CycleResult;
