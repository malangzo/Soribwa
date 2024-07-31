importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCzVMi3kq1pek8XDiD4_GM7KoTeQdQnm0I",
  authDomain: "soundproject-26e1d.firebaseapp.com",
  projectId: "soundproject-26e1d",
  storageBucket: "soundproject-26e1d.appspot.com",
  messagingSenderId: "894460366934",
  appId: "1:894460366934:web:aec70feb5cf13b807f2bf7",
  measurementId: "G-YEZWEYJ77P"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});