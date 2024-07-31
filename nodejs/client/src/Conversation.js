import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './Cycle.css';
import './Conversation.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Backspace from './components/Backspace';
import ConvInfo from './ConvInfo';
import startIcon from './images/start.png';
import stopIcon from './images/stop.png';

<link rel="manifest" href="/manifest.json" />

const Conversation = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioCtx, setAudioCtx] = useState(null);
    const [source, setSource] = useState(null);
    const [socket, setSocket] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [transcriptions, setTranscriptions] = useState([]);
    const bufferSize = 1024;
    const chunkSize = 1024; // 청크 크기 설정

    const transcriptionsEndRef = useRef(null);

    const scrollToBottom = () => {
        if (transcriptionsEndRef.current) {
            transcriptionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [transcriptions]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    
    const REACT_APP_FASTAPI = process.env.REACT_APP_FASTAPI;

    const startRecording = async () => {
        if (!isRecording) {
            setIsLoading(true);
            setIsRecording(true);

            const ws = new WebSocket('wss://mfastapi.soribwa.com/ws');
            setSocket(ws);

            ws.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log('Received message:', message);

                setTranscriptions(prev => [...prev, { text: message.text, emotion: message.emotion }]);

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
                setIsLoading(false);
            } catch (error) {
                console.error('Error accessing media devices:', error);
                setIsRecording(false);
                setIsLoading(false);
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
            <Backspace />
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <main>
                <div className='conversation-title'>대화 감정 분석</div>
                <ConvInfo />
                {isLoading && <div className="loading-message">Loading...</div>}
                <div className='script-container'>
                    {transcriptions.map((transcription, index) => (
                        transcription.text && transcription.text.trim() !== '' && (
                        <div className='transcription' key={index}>
                            <p className={`emotion-${transcription.emotion}`}>
                                {transcription.text}
                            </p>
                        </div>
                        )
                    ))}
                    <div ref={transcriptionsEndRef} />
                </div>
                <button id="transcript-button" className="play-button" onClick={isRecording ? stopRecording : startRecording}>
                    <img src={isRecording ? stopIcon : startIcon} alt={isRecording ? 'Stop' : 'Start'} />
                </button>
            </main>
            <Footer />
        </div>
    );
};

export default Conversation;
