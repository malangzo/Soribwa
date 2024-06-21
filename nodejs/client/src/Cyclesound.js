import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Cycle.css';
import Sidebar from './components/Sidebar';
import sideBar from './images/sideBar.png';
import backIcon from './images/backIcon.png';
import startIcon from './images/startIcon.png';
import stopIcon from './images/stopIcon.png';
import { Link, useNavigate } from "react-router-dom";

const Cyclesound = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const chunksRef = useRef([]);
    const [audioStream, setAudioStream] = useState(null);
    const [measuringText, setMeasuringText] = useState('');

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const startRecording = async () => {
        if (!isRecording) {
            setIsRecording(true);
            chunksRef.current = [];
            setRecordingTime(0);
            setMeasuringText('');
            document.querySelector('.circle').classList.add('recording');

            try {
                const audioIN = { audio: true };
                const stream = await navigator.mediaDevices.getUserMedia(audioIN);
                setAudioStream(stream);

                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                recorder.addEventListener('dataavailable', function (event) {
                    if (event.data.size > 0) {
                        chunksRef.current.push(event.data);
                    }
                });

                recorder.start();
                console.log('Recording started');
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        }
    };

    const sendDataToServer = useCallback(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');
        const dateObject = new Date();
        const options = { timeZone: 'Asia/Seoul', hour12: false };
        const timestamp = dateObject.toLocaleString('ko-KR', options);
        formData.append('timestamp', timestamp);

        const fastapi = process.env.REACT_APP_FASTAPI;
        console.log('Sending data to server:', fastapi);

        try {
            const response = await fetch(`${fastapi}/cycle/record-analyze`, {
                method: 'POST',
                body: formData,
            });
            

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            console.log('Server response:', result);
            navigate('/CycleResult');
        } catch (error) {
            console.log('Error sending data to server:', error);
        }
    }, [navigate]);

    const stopRecording = useCallback(() => {
        return new Promise((resolve, reject) => {
            const confirmStop = window.confirm('저장하시겠습니까?');
            if (confirmStop) {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    console.log('Stopping recording...');
                    
                    mediaRecorder.addEventListener('stop', async () => {
                        setIsRecording(false);
                        document.querySelector('.circle').classList.remove('recording');
                        
                        console.log('Chunks after stopping:', chunksRef.current);
                        if (chunksRef.current.length > 0) {
                            const blob = new Blob(chunksRef.current, { 'type': 'audio/wav' });
                            await sendDataToServer(blob);
                            resolve();
                        } else {
                            console.warn('No recorded chunks available.');
                            reject(new Error('No recorded chunks available.'));
                        }
                    }, { once: true });

                    mediaRecorder.stop();
                } else {
                    console.log("No recording is currently active.");
                    reject(new Error("No recording is currently active."));
                }
            } else {
                cancelRecording();
                reject(new Error("Recording cancelled."));
            }
        });
    }, [mediaRecorder, sendDataToServer]);

    const cancelRecording = useCallback(() => {
        const confirmCancel = window.confirm('녹음을 취소하시겠습니까?');
        if (confirmCancel) {
            chunksRef.current = [];
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                setIsRecording(false);
                console.log("Recording canceled");
            }
        } else {
            console.log("No recording to cancel.");
        }
    }, [isRecording, mediaRecorder]);

    useEffect(() => {
        let timer;
        if (isRecording) {
            timer = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [isRecording]);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <header className="header custom-header">
                <button className="menu-button" onClick={toggleSidebar}>
                    <img src={sideBar} alt="Menu" />
                </button>
                <h1>소리봐</h1>
                <Link to="/" className="back-link">
                    <button className="back-button">
                        <img src={backIcon} alt="Back" />
                    </button>
                </Link>
                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            </header>

            <main className='cyclemain'>
                <h2>내 공간 소음 측정</h2>
                <div className={`circle ${isRecording ? 'recording' : ''}`}>
                    <span className="measuring-text">{isRecording ? measuringText : ''}</span>
                    <span className="recording-time">{isRecording && (
                        <>
                            {formatTime(recordingTime)}
                            <br />
                            측정 중 입니다...
                        </>
                    )}</span>
                </div>
                <button className="play-button" onClick={isRecording ? () => stopRecording().catch(console.error) : startRecording}>
                    <img src={isRecording ? stopIcon : startIcon} alt={isRecording ? 'Stop' : 'Start'} />
                </button>
            </main>
        </div>
    );
};

export default Cyclesound;