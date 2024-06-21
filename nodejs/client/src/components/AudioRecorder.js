import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [chunks, setChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioStream, setAudioStream] = useState(null);

    const getFastapiValue = async () => {
        const response = await fetch('/path');
        const data = await response.json();
        return data.fastapi;
    };

    const startRecording = () => {
        if (!isRecording) {
            setIsRecording(true);
            document.querySelector('.measuring').innerText = '측정중입니다...';
            let time = 0;

            let audioIN = { audio: true };

            navigator.mediaDevices.getUserMedia(audioIN)
                .then(function (mediaStreamObj) {
                    setAudioStream(mediaStreamObj);

                    const recorder = new MediaRecorder(mediaStreamObj);
                    setMediaRecorder(recorder);
                    recorder.start();
                    console.log("Recording started");

                    const timer = setInterval(() => {
                        time++;
                        document.querySelector('.measuring').innerText = `측정중입니다... ${time}초 경과`;
                    }, 1000);

                    recorder.ondataavailable = function (event) {
                        setChunks(prevChunks => [...prevChunks, event.data]);
                    };

                    recorder.onstop = function () {
                        clearInterval(timer);
                        document.querySelector('.measuring').innerText = '측정이 완료되었습니다.';

                        const blob = new Blob(chunks, { 'type': 'audio/wav' });
                        sendDataToServer(blob);
                    };

                    recorder.onerror = function (error) {
                        clearInterval(timer);
                        console.error('Error during recording:', error);
                    };
                })
                .catch(function (err) {
                    console.log(err.name, err.message);
                });
        }
    };

    const sendDataToServer = async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.wav');
        const dateObject = new Date();
        const options = { timeZone: 'Asia/Seoul', hour12: false };
        const timestamp = dateObject.toLocaleString('ko-KR', options);
        formData.append('timestamp', timestamp);

        const fastapi = await getFastapiValue();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${fastapi}/cycle/record-analyze`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    window.location.href = '/cyclegraph.html';
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
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            console.log("Recording stopped");
            setIsRecording(false);
        } else {
            console.log("No recording is currently active.");
        }
    };

    const cancelRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            setChunks([]);
            document.querySelector('.measuring').innerText = '측정이 취소되었습니다.';
            console.log("Recording canceled");
        } else {
            console.log("No recording to cancel.");
        }
    };

    useEffect(() => {
        return () => {
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [audioStream]);

    return (
        <div>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <button onClick={cancelRecording}>Cancel Recording</button>
            <div className="measuring">Recording not started</div>
        </div>
    );
};

export default AudioRecorder;
