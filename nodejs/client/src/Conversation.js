import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './Cycle.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ConvInfo from './ConvInfo';
import startIcon from './images/start.png';
import stopIcon from './images/stop.png';

const Conversation = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const chunksRef = useRef([]);
    const [audioStream, setAudioStream] = useState(null);
    const [socket, setSocket] = useState(null);
    const [transcriptions, setTranscriptions] = useState([]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const startRecording = async () => {
        if (!isRecording) {
            setIsRecording(true);
            chunksRef.current = [];

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setAudioStream(stream);

                const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                setMediaRecorder(recorder);

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunksRef.current.push(event.data);
                        if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(event.data);
                        }
                    }
                };

                recorder.start(100); // Send audio data in 100ms chunks
                console.log('Recording started');

                const ws = new WebSocket('wss://mfastapi.soribwa.com/ws');
                ws.onopen = () => {
                    console.log('WebSocket connected');
                    setSocket(ws);
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

            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.onstop = () => {
                setIsRecording(false);
                console.log('Recording stopped');

                if (audioStream) {
                    audioStream.getTracks().forEach(track => track.stop());
                }
                if (socket) {
                    socket.close();
                }
            };
        }
    };

    useEffect(() => {
        return () => {
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
            if (socket) {
                socket.close();
            }
        };
    }, [audioStream, socket]);

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <main>
                <ConvInfo />
                <button className="play-button" onClick={isRecording ? stopRecording : startRecording}>
                    <img src={isRecording ? stopIcon : startIcon} alt={isRecording ? 'Stop' : 'Start'} />
                </button>
                <div>
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
