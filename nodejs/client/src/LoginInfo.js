import React, { useState } from "react";
import './App.css';
import questionmark from './images/questionmark2.png';

<link rel="manifest" href="/manifest.json" />

const LoginInfo = () => {
    const [showInfo, setShowInfo] = useState(false);

    const handleInfoClick = () => {
        setShowInfo(!showInfo);
    };

    const handleCloseClick = () => {
        setShowInfo(false);
        localStorage.setItem('infoClosed', 'true');
    };

    return (
        <>
            <button className="info-button" onClick={handleInfoClick}>
                <img src={questionmark} alt="?" className="info-icon" style={{ width: '40px', height: 'auto' }} />
            </button>
            {showInfo && (
                <div className="info-popup">
                    <div className="info-popup-close" onClick={handleCloseClick}>×</div>
                    <div className="info-popup-content">
                        <h2>소리봐 기능 설명</h2>
                        <p>소리봐는 중증 청각장애인을 위한 서비스입니다.</p>
                        <p>소음과 관련된 다양한 기능을 제공함으로써 보다 편리하고 안전한 생활을 지원합니다.</p>
                        <p>주요 기능은 다음과 같습니다.</p>
                        <ul>
                            <li>실시간 소음 분석: 다양한 환경 소음을 실시간으로 측정하고 분석하여 보여 줍니다.</li>
                            <li>소음 지도: 주변 소음 환경을 지도로 확인 가능합니다.</li>
                            <li>대화 감정 분석: 대화 내용을 실시간으로 텍스트 변환 및 감정 분석하여 보여 줍니다.</li>
                        </ul>
                        <p></p>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginInfo;