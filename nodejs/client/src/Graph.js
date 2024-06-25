// CycleResult.js
import React, { useState, useEffect } from 'react';
import './App.css';
import './Cycle.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import axios from 'axios';

const nodejs = process.env.REACT_APP_NODEAPI;

const CycleResult = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await axios.get(`${nodejs}/cycle/daygraph`);

        if (response.status === 200) {
          const img_base64 = `data:image/png;base64,${response.data.image}`;
          setImage(img_base64);
        } else {
          const errorMessage = response.data.message || 'Error during fetch';
          setError(errorMessage);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setError('Failed to fetch the graph. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
        <h2>측정 결과</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {image && <img src={image} alt="Graph" className="graph-image" />}
      </main>
    </div>
  );
};

export default CycleResult;
