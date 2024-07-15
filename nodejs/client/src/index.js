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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
    onScriptLoadError={() => console.log("실패")}
    onScriptLoadSuccess={() => console.log("성공")}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/Cyclesound' element={<Cyclesound />} />
        <Route path='/CycleResult' element={<CycleResult />} />
        <Route path='/Graph' element={<Graph />} />
        <Route path='/SoundMap' element={<SoundMap />} />
        <Route path='/Livesound' element={<Livesound />} />
        <Route path='/Setting' element={<Setting />} />
        <Route path='/Userinfo' element={<Userinfo />} />
        <Route path='/Conversation' element={<Conversation />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
