import React, { useState } from "react";
import './App.css';
import filtericon from './images/filtericon.png';

<link rel="manifest" href="/manifest.json" />

const Filter = ({ fetchData }) => {
    const [showButton, setShowButton] = useState(false);

    const handleButtonClick = () => {
        setShowButton(!showButton);
    };

    return (
        <div>
            <button className="filter-button" onClick={handleButtonClick}>
                <img src={filtericon} alt="filter-icon" style={{ width: '40px', height: 'auto' }} />
            </button>
            {showButton && (
                <div className="filter-options">
                    <button className="filter-option-button" onClick={() => fetchData('oneDay')}>
                        하루
                    </button>
                    <button className="filter-option-button" onClick={() => fetchData('week')}>
                        일주일
                    </button>
                    <button className="filter-option-button" onClick={() => fetchData('all')}>
                        전체
                    </button>
                </div>
            )}
        </div>
    );
};

export default Filter;
