import React, { useState, useEffect } from 'react';
import './App.css';

const MapInfo = () => {
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    const infoClosed = localStorage.getItem('infoClosed');
    if (infoClosed === 'true') {
      setShowInfo(false);
    }
  }, []);

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleCloseClick = () => {
    setShowInfo(false);
    localStorage.setItem('infoClosed', 'true');
  };

  return (
    <>
      <button className="info-button" onClick={handleInfoClick}>?</button>
      {showInfo && (
        <div className="info-popup">
          <div className="info-popup-close" onClick={handleCloseClick}>×</div>
          <div className="info-popup-content">
            <h2>소음 지도</h2>
            <p>이 지도는 주변에서 나는 소음 정보를 표시합니다.</p>
            <p>각 마커를 클릭할 시, 해당 지점에서 나는 소음의 종류와 데시벨을 확인 가능합니다.</p>
            <p>마커 주변의 원은 소음 레벨과 반경을 나타냅니다:</p>
            <ul>
              <li><span style={{ color: 'red' }}>●</span>&nbsp;&nbsp;빨강: 100dB 이상 소음</li>
              <li><span style={{ color: 'orange' }}>●</span>&nbsp;&nbsp;주황: 80dB 이상 소음</li>
              <li><span style={{ color: 'yellow' }}>●</span>&nbsp;&nbsp;노랑: 60dB 이상 소음</li>
            </ul>
            <p></p>
          </div>
        </div>
      )}
    </>
  );
};

export default MapInfo;