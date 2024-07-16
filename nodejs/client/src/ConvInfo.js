import React, { useState, useEffect } from 'react';
import './App.css';

const ConvInfo = () => {
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
            <h2>대화 감정 분석</h2>
            <p>녹음 버튼 클릭 시 대화 녹음을 시작합니다. (버튼을 다시 누르면 녹음이 중단됩니다.)</p>
            <p>녹음이 시작되면 대화 내용이 화면에 보여지며, 말하는 사람이 구분됩니다.</p>
            <p>대화에서 느껴지는 감정을 분석하며, 감정에 따라 대화 내용의 색이 바뀝니다.</p>
            <p>색깔에 따른 감정 차이</p>
            <ul>
              <li>검정: 평이</li>
              <li>빨강: 화남</li>
              <li>파랑: 슬픔</li>
            </ul>
            <p></p>
          </div>
        </div>
      )}
    </>
  );
};

export default ConvInfo;