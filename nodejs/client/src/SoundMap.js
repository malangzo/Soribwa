import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Backspace from './components/Backspace';
import KakaoMap from './Kakaomap';
import MapInfo from './MapInfo';
import Filter from './Filter';

<link rel="manifest" href="/manifest.json" />

const SoundMap = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [fetchData, setFetchData] = useState(null);
  const kakaomapRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
      if (kakaomapRef.current) {
        setFetchData(() => kakaomapRef.current.fetchData);
      }
  }, []);

  return (
    <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
      <Backspace />
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
        {fetchData && <Filter fetchData={fetchData} />}
        <MapInfo />
        <KakaoMap ref={kakaomapRef}/>
      </main>
      <Footer />
    </div>
  );
};

export default SoundMap;
