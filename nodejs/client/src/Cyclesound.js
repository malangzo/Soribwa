import React, { useState, useEffect } from 'react';
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
    const [chunks, setChunks] = useState([]);
    const [audioStream, setAudioStream] = useState(null);
    const [measuringText, setMeasuringText] = useState('');

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const startRecording = async () => {
        if (!isRecording) {
            setIsRecording(true);
            setChunks([]);
            setRecordingTime(0);
            setMeasuringText('');
            document.querySelector('.circle').classList.add('recording'); // 원의 색상 변경

            try {
                const audioIN = { audio: true };
                const stream = await navigator.mediaDevices.getUserMedia(audioIN);
                setAudioStream(stream);

                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                recorder.addEventListener('dataavailable', function (event) {
                    if (event.data.size > 0) {
                        setChunks(prevChunks => [...prevChunks, event.data]);
                    }
                });

                recorder.addEventListener('stop', async function () {
                    setIsRecording(false);
                    setMeasuringText('측정이 완료되었습니다.');
                    document.querySelector('.circle').classList.remove('recording');

                    const blob = new Blob(chunks, { 'type': 'audio/wav' });
                    if (shouldSendData) {
                        await sendDataToServer(blob);
                        navigate('/CycleResult');
                    }
                });

                recorder.addEventListener('error', function (error) {
                    console.error('Recording error:', error);
                });

                recorder.start();
                console.log('Recording started');
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        }
    };

    const sendDataToServer = async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');
        const dateObject = new Date();
        const options = { timeZone: 'Asia/Seoul', hour12: false };
        const timestamp = dateObject.toLocaleString('ko-KR', options);
        formData.append('timestamp', timestamp);

        const fastapi = process.env.REACT_APP_FASTAPI;
        console.log(fastapi);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${fastapi}/cycle/record-analyze`, true);
        //xhr.setRequestHeader("content-type", "multipart/form-data");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                } else {
                    console.error('Network response was not ok.');
                }
            }
        };

        xhr.onerror = function (error) {
            console.error('There was an error!', error);
        };
        xhr.send(formData);
    };

    const stopRecording = () => {
        const confirmStop = window.confirm('저장하시겠습니까?');
        if (confirmStop) {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                setShouldSendData(true);
                mediaRecorder.stop();
                console.log("Recording stopped");

                document.querySelector('.circle').classList.remove('recording');

                if (chunks.length > 0) {
                    const blob = new Blob(chunks, { 'type': 'audio/wav' });
                    sendDataToServer(blob);
                } else {
                    console.warn('No recorded chunks available.');
                }
            } else {
                console.log("No recording is currently active.");
            }
        } else {
            cancelRecording();
        }
    };

    const cancelRecording = () => {
        const confirmCancel = window.confirm('녹음을 취소하시겠습니까?');
        if (confirmCancel) {
            if (mediaRecorder && isRecording) {
                setShouldSendData(false);  // Ensure data is not sent
                mediaRecorder.stop();
                setIsRecording(false);
                setChunks([]); // 모든 청크 초기화
                setMeasuringText('측정이 취소되었습니다.');
                console.log("Recording canceled");
            } else {
                console.log("No recording to cancel.");
            }
        }
    };

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

    const [shouldSendData, setShouldSendData] = useState(false);

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
                <button className="play-button" onClick={isRecording ? stopRecording : startRecording}>
                    <img src={isRecording ? stopIcon : startIcon} alt={isRecording ? 'Stop' : 'Start'} />
                </button>
            </main>
        </div>
    );
};

export default Cyclesound;
