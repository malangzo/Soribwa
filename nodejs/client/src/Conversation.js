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

    const [streamtest, setStreamTest] = useState();
    const [recordtest, setRecordTest] = useState();

    let test;


    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const startRecording = async () => {
        if (!isRecording) {
            setIsRecording(true);
            chunksRef.current = [];
    
            try {
                // 사용자 음성 스트림을 가져옵니다
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setAudioStream(stream);
                
                // MediaRecorder를 생성하여 오디오 스트림을 녹음합니다
                const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                setMediaRecorder(recorder);
    
                const ws = new WebSocket('wss://mfastapi.soribwa.com/ws');

                ws.onopen = () => {
                    console.log('WebSocket connected');
                    setSocket(ws);
                    var test = ws;
                    console.log(test);
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

    
                // MediaRecorder의 데이터가 준비되면 WebSocket을 통해 전송합니다
                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunksRef.current.push(event.data);
                        //console.log('Audio data available:', event.data);
                        
                        // Blob을 ArrayBuffer로 변환하여 전송합니다
                        if (ws.readyState === WebSocket.OPEN) {
                            
                            const reader = new FileReader();
                            reader.onload = () => {
                                ws.send(reader.result);
                                //console.log('Audio data sent:', reader.result);
                            };
                            reader.readAsArrayBuffer(event.data);
                        }
                    }
                };
    
                // MediaRecorder를 시작합니다
                recorder.start(100); // 100ms 간격으로 청크를 보냅니다
                console.log('Recording started');
    
            } catch (error) {
                console.error('Error accessing media devices:', error);
                setIsRecording(false);
            }
        }
    };
    

    const stopRecording = () => {
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

    // useEffect(() => {
    //     return () => {
    //         if (audioStream) {
    //             audioStream.getTracks().forEach(track => track.stop());
    //         }
    //         if (socket) {
    //             socket.close();
    //         }
    //     };
    // }, [audioStream, socket]);

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
