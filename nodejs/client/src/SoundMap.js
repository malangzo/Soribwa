import React, { useState } from 'react';
import './App.css';
import './Cycle.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // DatePicker의 스타일 가져오기
import { FaSearch } from 'react-icons/fa'; // FaSearch 아이콘 가져오기

const nodejs = process.env.REACT_APP_NODEAPI;

const Graph = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const fetchGraph = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${nodejs}/cycle/daygraph`, {
        start: startDate ? startDate.toISOString().split('T')[0] : null,
        end: endDate ? endDate.toISOString().split('T')[0] : null,
      });
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

  const setChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
        <h2>측정 그래프</h2>
        <div className="date-picker-container">
          <DatePicker
            selectsRange={true}
            className="datepicker"
            dateFormat="yy.MM.dd"
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            onChange={(dates) => setChangeDate(dates)}
          />
          <button className="search-button" onClick={fetchGraph}>
            <FaSearch/>
          </button>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {image && <img src={image} alt="Graph" className="graph-image" />}
      </main>
    </div>
  );
};

export default Graph;
