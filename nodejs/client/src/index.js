import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Cyclesound from './Cyclesound';
import CycleResult from './CycleResult';
import Graph from './Graph';
import SoundMap from './SoundMap';
import Livesound from './Livesound';
import Setting from './Setting';
import Userinfo from './Userinfo';
import Conversation from './Conversation';
import Login from './LOGIN/Login';
import Register from './LOGIN/Register';
import NoticeList from './NOTICE/NoticeList';
import NoticeWrite from './NOTICE/NoticeWrite';
import NoticeEdit from './NOTICE/NoticeEdit';
import NoticeContent from './NOTICE/NoticeContent';

import NaverLoginSave from "./LOGIN/SocialLoginSave";
import { Cookies, CookiesProvider } from "react-cookie";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

const REACT_APP_FASTAPI = process.env.REACT_APP_FASTAPI;
const FIREBASEAPI = process.env.REACT_APP_FIREBASE_API;
const VAPIDKEY = process.env.REACT_APP_VAPID_KEY;

const firebaseConfig = {
  apiKey: FIREBASEAPI,
  authDomain: "soundproject-26e1d.firebaseapp.com",
  projectId: "soundproject-26e1d",
  storageBucket: "soundproject-26e1d.appspot.com",
  messagingSenderId: "894460366934",
  appId: "1:894460366934:web:aec70feb5cf13b807f2bf7",
  measurementId: "G-YEZWEYJ77P"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const askForNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');

    const token = await getToken(messaging, { vapidKey: VAPIDKEY });
    if (token) {
      console.log('FCM Token:', token);
      sessionStorage.setItem('fcmToken', token);
      // 토큰을 서버로 전송
      await fetch(`${REACT_APP_FASTAPI}/saveToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } else {
      console.log('No registration token available.');
    }
  } else {
    console.log('Notification permission denied.');
  }
};

const subscribeUserToPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(VAPIDKEY) // VAPID 공개키
  });

  console.log('User subscribed to push:', subscription);

  // 구독 정보를 서버로 전송
  await fetch(`${REACT_APP_FASTAPI}/saveToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription }),
  });
};


// VAPID 공개키를 Uint8Array로 변환하는 함수
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

onMessage(messaging, (payload) => {
  console.log('Received message ', payload);

  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '../public/logo192.png',
        tag: "uniqueTag"
      });
    });
  } else {
    console.log('Service Worker is not available.');
  }
});

function tokenCheck() {
    const cookies = new Cookies();
    const accessToken = sessionStorage.getItem('accessToken');
    const userToken = {'accessToken':accessToken};
    const decookie = decodeURIComponent(document.cookie);
    const cookie = decookie.split(";");
    console.log("check cs:", cookie);
    console.log('jwt: ', cookies.get('jwt'))
    // if (userToken?.accessToken) {
    //     fetch('https://jnodejs.soribwa.com/posts', {
    //         method: 'GET',
    //         headers: {
    //             "Content-Type": "application/json",
    //             //Authorization: `Bearer ${document.cookie.indexOf('jwt=')}`,
    //             Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
    //             credentials: "include",
                
    //         },
    //     }).then((res) => {
            // console.log('ref res', res.status, res.message, res.message, res, res.data)
            // if (res.status == 403) {
            //     fetch('https://jnodejs.soribwa.com/refresh', {
            //         method: 'GET',
            //         headers: {
            //             "Content-Type": "application/json",
            //             //Authorization: `Bearer ${document.cookie.indexOf('jwt=')}`,
            //             Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            //             credentials: "same-origin",
                        
            //         },
            //     }).then((res0) => {
            //         console.log('ref res', res0.status, res0.message, res0.message, res0, res0.data)
            //     })
            // }
        // })
    //}
    return userToken?.accessToken

}

const token = tokenCheck();

askForNotificationPermission();

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
    onScriptLoadError={() => console.log("실패.ㅎ")}
    onScriptLoadSuccess={() => console.log("")}>
    <CookiesProvider>
    <BrowserRouter>
      <Routes>
        {/* <Route path='/App' element={token ? <App /> : <Login/>} /> */}
        <Route path='/App' element={<App />} />
        <Route path='/Cyclesound' element={<Cyclesound />} />
        <Route path='/CycleResult' element={<CycleResult />} />
        <Route path='/Graph' element={<Graph />} />
        <Route path='/SoundMap' element={<SoundMap />} />
        <Route path='/Livesound' element={<Livesound />} />
        <Route path='/Setting' element={<Setting />} />
        <Route path='/Userinfo' element={<Userinfo />} />
        <Route path='/Conversation' element={<Conversation />} />
        <Route path='/' element={token ? <App/> : <Login/>} />
        <Route path='/Register' element={<Register />} />
        <Route path='/NoticeList' element={<NoticeList />} />
        <Route path='/NoticeWrite' element={<NoticeWrite />} />
        <Route path='/NoticeEdit/:notice_no' element={<NoticeEdit />} />
        <Route path='/NoticeContent/:notice_no' element={<NoticeContent />} />
        <Route path='/SocialLoginSave' element={<NaverLoginSave />} />
      </Routes>
    </BrowserRouter>
    </CookiesProvider>
  </GoogleOAuthProvider>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
      return registration.pushManager.getSubscription();
    })
    .then((subscription) => {
      if (subscription) {
        console.log('Service Worker subscription:', subscription);
      } else {
        console.log('No active service worker subscription');
        
        subscribeUserToPush();
      }
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}
