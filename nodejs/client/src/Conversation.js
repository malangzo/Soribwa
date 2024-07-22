import React, { useState, useRef } from 'react';
import './App.css';
import './Cycle.css';
import './Conversation.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ConvInfo from './ConvInfo';
import startIcon from './images/start.png';
import stopIcon from './images/stop.png';

const Conversation = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioCtx, setAudioCtx] = useState(null);
    const [source, setSource] = useState(null);
    const [socket, setSocket] = useState(null);
    const [transcriptions, setTranscriptions] = useState([]);
    const bufferSize = 1024;
    const chunkSize = 1024; // 청크 크기 설정

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const startRecording = async () => {
        if (!isRecording) {
            setIsRecording(true);

            // WebSocket을 통해 서버와 연결합니다
            const ws = new WebSocket('wss://mfastapi.soribwa.com/ws');
            setSocket(ws);

            ws.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.onmessage = (event) => {
                const message = event.data;
                console.log('Received message:', message);
                setTranscriptions((prev) => [...prev, message]);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setSocket(null);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // AudioContext와 ScriptProcessorNode 설정
                const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                setAudioCtx(ctx);

                const scriptNode = ctx.createScriptProcessor(bufferSize, 1, 1);
                const sourceNode = ctx.createMediaStreamSource(stream);
                setSource(sourceNode);

                sourceNode.connect(scriptNode);
                scriptNode.connect(ctx.destination);

                scriptNode.onaudioprocess = (event) => {
                    const inputBuffer = event.inputBuffer;
                    const rawData = inputBuffer.getChannelData(0); // PCM 데이터
                    const int16Array = new Int16Array(rawData.length);

                    for (let i = 0; i < rawData.length; i++) {
                        int16Array[i] = rawData[i] * 32767; // Convert to 16-bit PCM
                    }

                    // 데이터를 청크 단위로 나누어 전송
                    for (let i = 0; i < int16Array.length; i += chunkSize) {
                        const chunk = int16Array.slice(i, i + chunkSize);

                        // WebSocket을 통해 청크 전송
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(chunk.buffer);
                        }
                    }
                };

                console.log('Recording started');
            } catch (error) {
                console.error('Error accessing media devices:', error);
                setIsRecording(false);
            }
        }
    };

    const stopRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            if (source) {
                source.disconnect();
                setSource(null);
            }
            if (audioCtx) {
                audioCtx.close();
                setAudioCtx(null);
            }
            if (socket) {
                socket.close();
                setSocket(null);
            }
            console.log('Recording stopped');
        }
    };

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <main>
                <ConvInfo />
                <button className="play-button" onClick={isRecording ? stopRecording : startRecording}>
                    <img src={isRecording ? stopIcon : startIcon} alt={isRecording ? 'Stop' : 'Start'} />
                </button>
                <div className='transcriptions'>
                    {transcriptions.map((transcription, index) => (
                        <p key={index}>{transcription}</p>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Conversation;
