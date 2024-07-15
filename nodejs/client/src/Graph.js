import React, { useState } from 'react';
import './App.css';
import './Cycle.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { FaSearch } from 'react-icons/fa';

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

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }

  const fetchGraph = async () => {
    setLoading(true);
    setError(null);
    try {
      const formattedStartDate = startDate ? formatDate(startDate) : null;
      const formattedEndDate = endDate ? formatDate(endDate) : null;

      if (!formattedStartDate || !formattedEndDate) {
        setError('날짜를 입력해주세요.');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${nodejs}/cycle/daygraph`, {
        startdate: formattedStartDate,
        enddate: formattedEndDate,
      });

      if (response.status === 200) {
        if (response.data.message === 'No data') {
          setImage(null); 
          setError('No data');
        } else {
          const img_base64 = `data:image/png;base64,${response.data.image}`;
          setImage(img_base64);
          setError(null);
        }
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
        {!isLoading && !error && !image && startDate && endDate && <p>No data</p>}
      </main>
      <Footer />
    </div>
  );
};

export default Graph;
