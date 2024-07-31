import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from "axios";
import './Cycle.css';
import Sidebar from './components/Sidebar';
import sidebarIcon from './images/main_left.png';
import startIcon from './images/start.png';
import stopIcon from './images/stop.png';
import soribwa from './images/soribwa.png';
import Backspace from './components/Backspace';

import { Link, useNavigate } from "react-router-dom";


// import Session from 'react-session-api';

// import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';

import dogBarkImage from './images/dog_bark.png';
import drillingImage from './images/drilling.png';
import childrenPlayingImage from './images/children_playing.png';
import streetMusicImage from './images/street_music.png';
import airConditionerImage from './images/air_conditioner.png';
import carHornImage from './images/car_horn.png';
import engineIdlingImage from './images/engine_idling.png';
import jackhammerImage from './images/jackhammer.png';
import gunShotImage from './images/gun_shot.png';
import sirenImage from './images/siren.png';
            
const labelImages = {
    'dog_bark': dogBarkImage,
    'drilling': drillingImage,
    'children_playing': childrenPlayingImage,
    'street_music': streetMusicImage,
    'air_conditioner': airConditionerImage,
    'car_horn': carHornImage,
    'engine_idling': engineIdlingImage,
    'jackhammer': jackhammerImage,
    'gun_shot': gunShotImage,
    'siren': sirenImage,
    'silence': ''
};

<link rel="manifest" href="/manifest.json" />

const Livesound = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [isLoading, setLoading] = useState(true);
    //const [error, setError] = useState(null);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };


    const [stream, setStream] = React.useState();
    const [media, setMedia] = React.useState();
    const [source, setSource] = React.useState();
    const [analyser, setAnalyser] = React.useState();
    const [audioUrl, setAudioUrl] = React.useState();
    const [disabled, setDisabled] = React.useState(false);
    const [geoCode, setGeoCode] = React.useState();

    let dbPost = {
        "timemap":"",
        "label":"",
        "decibel":0,
    };

    var medimedi;
    var streamd;
    var sourced;
    var analyserd;
    var audioUrld;
    var disabledd;
    var onRec = true;
    var imageTagOn = `
                                <img src=${startIcon} alt="Play" />
                `;
    const imageCircleOn = `
                            <circle cx="130" cy="130" r="127.5" stroke="#0532A9" stroke-width="5"/>
                ` ;
    const [imagePath, setImagePath] = React.useState(imageTagOn);
    const [isClicked, setIsClicked] = React.useState(true);
    const [interId, setInterId] = React.useState();
    var cachelog = "";


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        const btntext = document.getElementById("popText");
        btntext.innerHTML = sessionStorage.getItem('data').split('\n').slice(-100, -1).join('\n');
    };
    const handleClose = () => {
        setOpen(false);
    };

    // const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    //     '& .MuiDialogContent-root': {
    //         padding: theme.spacing(2),
    //         "whiteSpace": "pre-wrap",
    //     },
    //     '& .MuiDialogActions-root': {
    //         padding: theme.spacing(1),
    //     },
    // }));

    var bufferLength;
    var maxVol;
    var minVol;
    var vol;

    /////

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    function success(pos) {
        const crd = pos.coords;

        console.log("위치: ")
        console.log("Lati: ", crd.latitude);
        console.log("Longti: ", crd.longitude);
        console.log(`More or less ${crd.accuracy}meters.`);
        setGeoCode(crd.latitude.toString() + crd.longitude.toString());
        //sessionStorage.setItem("geo", crd.latitude.toString() + crd.longitude.toString());
    }

    function error(err) {
        console.warn(`ERROR($(err.code)): ${err.message}`);
    }


    const onRecAudio = () => {
        // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyse = audioCtx.createAnalyser();
        var audioBuffer = audioCtx.createBuffer(2, 22050, 44100);
        // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
        const analyser = audioCtx.createScriptProcessor(0, 1, 1);
        setAnalyser(analyser);
        analyserd = analyser;

        function makeSound(stream) {
            // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
            const source = audioCtx.createMediaStreamSource(stream);
            setSource(source);
            sourced = source;
            sourced.connect(analyserd);
            sourced.connect(analyse);
            analyserd.connect(audioCtx.destination);


        }
        // 마이크 사용 권한 획득
        const visualizer = document.getElementById("visualizer");
        navigator.geolocation.getCurrentPosition(success,error, options);
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            MediaRecorder.isTypeSupported("audio/wav;codecs=MS_PCM")
            mediaRecorder.start();
            onRec = false;
            setStream((stream) => stream);
            streamd = stream;
            setMedia((media) => mediaRecorder);
            medimedi = mediaRecorder;

            makeSound(stream);

            analyse.fftSize = 256;
            bufferLength = analyse.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);


            // drawVisualizer();

            // function drawVisualizer() {
            //     requestAnimationFrame(drawVisualizer)
            //     const bufferLength = analyse.frequencyBinCount
            //     const dataArray = new Uint8Array(bufferLength)

            //     // Updating the analyzer with the new 
            //     // generated data visualization
            //     analyse.getByteFrequencyData(dataArray)
            //     const width = visualizer.width
            //     const height = visualizer.height
            //     const barWidth = 10
            //     const canvasContext = visualizer.getContext('2d')
            //     canvasContext.clearRect(0, 0, width, height)
            //     let x = 0
            //     dataArray.forEach((item, index, array) => {
            //         // console.log("test", item, index) // chunk error

            //         // This formula decides the height of the vertical
            //         // lines for every item in dataArray
            //         const y = item / 255 * height * 1.1
            //         canvasContext.strokeStyle = `blue`;

            //         // This decides the distances between the
            //         // vertical lines
            //         x = x + barWidth
            //         canvasContext.beginPath();
            //         canvasContext.lineCap = "round";
            //         canvasContext.lineWidth = 5;
            //         canvasContext.moveTo(x, height);
            //         canvasContext.lineTo(x, height - y);
            //         canvasContext.stroke();
            //     });
            // };

            analyserd.onstart = function (e) {
                // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
                if (e.playbackTime > 180) {
                    stream.getAudioTracks().forEach(function (track) {
                        track.stop();
                    });
                    mediaRecorder.stop();
                    // 메서드가 호출 된 노드 연결 해제
                    analyser.disconnect();
                    audioCtx.createMediaStreamSource(stream).disconnect();
                    mediaRecorder.ondataavailable = function (e) {
                        setAudioUrl(e.data);
                        onRec = true;
                    };
                } else {
                    onRec = false;
                }
            };
        });
    };


    const REACT_APP_JAEHYUCK_NODEAPI=process.env.REACT_APP_JAEHYUCK_NODEAPI
    const REACT_APP_FASTAPI=process.env.REACT_APP_FASTAPI
    
    // 사용자가 음성 녹음을 중지했을 때
    const offRecAudio = () => {

        medimedi.ondataavailable = function (e) {
            audioUrld = e.data;
            setAudioUrl(e.data);
            onRec = true;
        };

        streamd.getAudioTracks().forEach(function (track) {
            track.stop();
        });

        // 미디어 캡처 중지
        medimedi.stop();
        // 메서드가 호출 된 노드 연결 해제
        analyserd.disconnect();
        sourced.disconnect();

        medimedi.onstop = function (ev) {
            let uploadFileAxios = async () => {
                const sound = new File([audioUrld], "soundBlob", { lastModified: new Date().getTime(), type: "audio/wav" });
                // console.log("off sound :",sound);
                const formData = new FormData();

                formData.append('file', sound);
                formData.append('timestamp', 'gigi')
                const chn = document.getElementById("inner");
                const lbimg = document.getElementById("label_image");
                const lbtxt = document.getElementById("label_text");
                const label_kor = {
                    'dog_bark': '강아지 짖는 소리', 'drilling': '전동 드릴 소리', 'children_playing': '아이들 노는 소리', 'street_music': '음악 소리', 'air_conditioner': '에어컨 소리',
                    'car_horn': '자동차 경적 소리', 'engine_idling': '엔진 소리', 'jackhammer': '천공기 소리', 'gun_shot': '총 소리', 'siren': '사이렌 소리', 'silence': '입력 대기중'
                };

                return axios.post(`${REACT_APP_JAEHYUCK_NODEAPI}/audio_test`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(response => {
                        lbimg.innerHTML = `<img id="label_img" src="${labelImages[response.data.label]}"></img>`;          
                        lbtxt.innerHTML = `${label_kor[response.data.label]}<br>${response.data.dB}dB`
                        cachelog += `${response.data.date.substr(11,18)}    ${response.data.label}    ${response.data.dB}dB\n`;
                        sessionStorage.setItem("data", cachelog);
                        
                        dbPost.timemap = response.data.date;
                        dbPost.label = response.data.label;
                        dbPost.decibel = response.data.dB;

                        function getLocation() {
                            return new Promise((res, req) => {
                                navigator.geolocation.getCurrentPosition(res,req, options)
                            })
                        }
                        if (response.data.label != 'slience') {
                            async function toDataBase() {
                                var loca = await getLocation();
                                console.log('geo: ', loca.coords.latitude, loca.coords.longitude)
                                dbPost.timemap = loca.coords.latitude.toString() + loca.coords.longitude.toString() + dbPost.timemap;
                                console.log(dbPost)
                                const timemapRes = await fetch(`${REACT_APP_FASTAPI}/realtimeInsert`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(dbPost)
                                })
                            }
                            toDataBase()
                        }
                        })
                        
                        // async test() {
                        //     const getTime = await getLocation();
                        //     console.log("testset", getTime.coords.latitude)
                        // }

                        // console.log(timemap)
                        // console.log(timemap().latitude,timemap().longitude)

                        // async function postData() {
                        //     try {
                        //         const response = await fetch("/realtimeInsert", {
                        //             method: "POST",
                        //             body: {
                        //                 timemap: 
                        //             }
                        //         })
                        //     }

                        // }

                        // new Promise navigator.geolocation.getCurrentPosition(success,error, options)
                        // .then(geo => {
                        //     console.log('test',geo)
                        // })

                        // sessionStorage.setItem("geo", geoCode);
                        // var cachelog_array = cachelog.split('\n').slice(-100, -1);
                    //})
                    .catch(err => {
                        console.error('파일 전송 중 오류 발생:', err);
                    });
            };

            let realtime_log = uploadFileAxios();
        }

        const chn = document.getElementById("inner");

        setDisabled(false);
    };

    // const onSubmitAudioFile = React.useCallback(() => {
    //     if (audioUrld) {
    //         console.log('URL check', URL.createObjectURL(audioUrld)); // 출력된 링크에서 녹음된 오디오 확인 가능
    //     }
    //     // File 생성자를 사용해 파일로 변환
    //     const sound = new File([audioUrld], "soundBlob", { lastModified: new Date().getTime(), type: "audio/wav" });

    //     const chn = document.getElementById("inner");
    //     let uploadFileAxios = (file) => {
    //         const formData = new FormData();
    //         formData.append('file', file);
    //         formData.append('timestamp', 'gigi')
    //         return axios.post(`${REACT_APP_JAEHYUCK_NODEAPI}/model_test`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         })
    //             .then(response => {
    //                 console.log(response.data);
    //             })
    //             .catch(error => {
    //                 console.error('파일 전송 중 오류 발생:', error);
    //             });
    //     };
    //     let up_test = uploadFileAxios(sound);

    //     setDisabled(false);

    // }, [audioUrl]);


    const audioInterval = async () => {
        var imageTagOff = `<img src=${stopIcon} alt="Play" />`;
        const imageCircleOff = `
                            <circle cx="130" cy="130" r="127.5" stroke="#FEC6C7" stroke-width="5"/>
                            ` ;
        const playBtn = document.getElementsByClassName('play-button')[0];
        const imageCircle = document.getElementById("circlesvg");

        function saveData() {

            onRecAudio();
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function delay_func() {
                for (let i = 0; i < 3; i++) {
                    await sleep(i * 1000);
                }
                offRecAudio();
            }
            delay_func();
        }

        const lbimg = document.getElementById("label_image");
        const lbtxt = document.getElementById("label_text");

        if (isClicked) {
            setImagePath(imageTagOff);
            setIsClicked(false);
            playBtn.innerHTML = imageTagOff;
            imageCircle.innerHTML = imageCircleOff;
            lbtxt.innerHTML = `측정중 입니다...`;
            const intervalId = setInterval(() => { saveData() }, 5000);
            console.log("inter 0 :", intervalId);
            setInterId(intervalId);
        } else {
            setImagePath(imageTagOn);
            setIsClicked(true);
            playBtn.innerHTML = imageTagOn;
            imageCircle.innerHTML = imageCircleOn;
            lbimg.innerHTML = ``;
            lbtxt.innerHTML = ``;
            clearInterval(interId);
            console.log("inter 1 :", interId);
        };
    }
    const childPopup = React.useRef();

    return (
        <div className={`container ${isSidebarOpen ? 'blur' : ''}`}>
            <Backspace />
            <header className="header custom-header">
                <div className="header-content">
                    <button className="menu-button" onClick={toggleSidebar}>
                        <img src={sidebarIcon} alt="Menu" />
                    </button>
                    <div className='menu-yellow'>
                        <img src={soribwa} alt="soribwa" />
                    </div>
                </div>
                <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            </header>

            <main className='cyclemain'>
                    {/* <div id="logcap">
                        <svg id="reallog" width="30" height="21" viewBox="0 0 30 21" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleClickOpen}>
                            <path d="M5.625 6.5625C6.66053 6.5625 7.5 5.72303 7.5 4.6875C7.5 3.65197 6.66053 2.8125 5.625 2.8125C4.58947 2.8125 3.75 3.65197 3.75 4.6875C3.75 5.72303 4.58947 6.5625 5.625 6.5625Z" fill="black" />
                            <path d="M5.625 12.1875C6.66053 12.1875 7.5 11.348 7.5 10.3125C7.5 9.27697 6.66053 8.4375 5.625 8.4375C4.58947 8.4375 3.75 9.27697 3.75 10.3125C3.75 11.348 4.58947 12.1875 5.625 12.1875Z" fill="black" />
                            <path d="M5.625 17.8125C6.66053 17.8125 7.5 16.973 7.5 15.9375C7.5 14.902 6.66053 14.0625 5.625 14.0625C4.58947 14.0625 3.75 14.902 3.75 15.9375C3.75 16.973 4.58947 17.8125 5.625 17.8125Z" fill="black" />
                            <path d="M25.3125 5.625H12.1875C11.6625 5.625 11.25 5.2125 11.25 4.6875C11.25 4.1625 11.6625 3.75 12.1875 3.75H25.3125C25.8375 3.75 26.25 4.1625 26.25 4.6875C26.25 5.2125 25.8375 5.625 25.3125 5.625ZM25.3125 11.25H12.1875C11.6625 11.25 11.25 10.8375 11.25 10.3125C11.25 9.7875 11.6625 9.375 12.1875 9.375H25.3125C25.8375 9.375 26.25 9.7875 26.25 10.3125C26.25 10.8375 25.8375 11.25 25.3125 11.25ZM25.3125 16.875H12.1875C11.6625 16.875 11.25 16.4625 11.25 15.9375C11.25 15.4125 11.6625 15 12.1875 15H25.3125C25.8375 15 26.25 15.4125 26.25 15.9375C26.25 16.4625 25.8375 16.875 25.3125 16.875Z" fill="black" />
                        </svg>
                    </div> */}
                    <div className="image_circle">
                        <div id="label_image">
                        </div>
                        <div id="label_case">
                            <svg id="circlesvg" width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="130" cy="130" r="127.5" stroke="#0532A9" strokeWidth="5" />
                            </svg>
                        </div>
                        <div id="label_text">
                        </div>
                    </div>
                    <div className="btnplay">
                        <button className="play-button" onClick={audioInterval}>
                            <img src={startIcon} alt="Play" />
                        </button>
                    </div>
    
                    {/* <div id="cancase">
                        <canvas id="visualizer" width="100px" height="100px" style={{ border: "5px solid blue", borderRadius: "100px" }}></canvas>
                    </div> */}
                    
            </main>
        </div>
    );
};

export default Livesound;