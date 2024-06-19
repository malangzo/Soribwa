let mediaRecorder;
let audioStream;
let isRecording = false;
let chunks = [];

async function getFastapiValue() {
    const response = await fetch('/path'); 
    const data = await response.json(); 
    return data.fastapi;
}

async function getTeamOne() {
    const response = await fetch('/team_one'); 
    const data = await response.json(); 
    return data.team_one;
}

const startRecording = () => {
    if (!isRecording) { 
        isRecording = true;
        isCanceled = false;
        document.querySelector('.measuring').innerText = '측정중입니다...';
        let time = 0; 

        let audioIN = { audio: true };

        navigator.mediaDevices.getUserMedia(audioIN)
            .then(function (mediaStreamObj) {
                audioStream = mediaStreamObj;

                mediaRecorder = new MediaRecorder(audioStream);

                mediaRecorder.start();
                console.log("Recording started");

                const timer = setInterval(() => {
                    time++;
                    document.querySelector('.measuring').innerText = `측정중입니다... ${time}초 경과`;
                }, 1000);

                mediaRecorder.ondataavailable = function (event) {
                    chunks.push(event.data);
                };

                mediaRecorder.onstop = function () {
                    if (!isCanceled) { 
                        clearInterval(timer); 
                        document.querySelector('.measuring').innerText = '측정이 완료되었습니다.';
                
                        const blob = new Blob(chunks, { 'type': 'audio/wav' });
                        sendDataToServer(blob);
                    }
                };

                mediaRecorder.onerror = function (error) {
                    clearInterval(timer);
                    console.error('Error during recording:', error);
                };

                mediaRecorder.oncancel = function (error) {
                    clearInterval(timer); 
                    document.querySelector('.measuring').innerText = '측정이 취소되었습니다.';
                    isRecording = false;
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
    //xhr.setRequestHeader("content-type", "multipart/form-data");
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
    } else {
        console.log("No recording is currently active.");
    }
};

const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
        mediaRecorder.oncancel();
        isRecording = false;
        console.log("Recording canceled");
        chunks = [];
        document.querySelector('.measuring').innerText = '측정이 취소되었습니다.';
    } else {
        console.log("No recording to cancel.");
    }
};

async function setDynamicImageSrc() {
    const fastapi = await getFastapiValue();
    const imgElement = document.getElementById('dynamicImage');
    imgElement.src = `${fastapi}/cycle/graph`;
}

// async function setTeamOne() {
//     const teamapi = await getTeamOne();
//     const team_one = document.getElementById('team_one');
//     team_one.href = `${teamapi}`;
// }

