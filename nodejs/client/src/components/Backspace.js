import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Backspace.css';
import backIcon from '../images/back.png';

<link rel="manifest" href="/manifest.json" />

const Backspace = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isValidPath, setIsValidPath] = useState(true);

    useEffect(() => {
        const checkValidPath = async () => {
            try {
                const response = await fetch(`${location.path}`);
                if (response.ok) {
                    setIsValidPath(true);
                } else {
                    setIsValidPath(false);
                }
            } catch (error) {
                setIsValidPath(false);
                console.error('Error checking valid path:', error);
            }
        };

        checkValidPath();
    }, [location.path]);

    useEffect(() => {
        if (!isValidPath) {
            navigate('/NoticeList');
        }
    }, [isValidPath, navigate]);

    const handleBackButtonClick = () => {
        if (location.pathname !== '/App') {
            if (isValidPath) {
                navigate(-1);
            } else {
                navigate('/App');
            }
        }
    };

    return (
        <button className="backspace" onClick={handleBackButtonClick}>
            <img src={backIcon} alt="Back" />
        </button>
    );
};

export default Backspace;