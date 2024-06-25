import React from 'react';
import ReactDOM from 'react-dom/client'; // render 함수를 ReactDOM에서 가져옵니다.
import App from './App';
import Cyclesound from './Cyclesound';
import CycleResult from './CycleResult';
import Graph from './Graph';
import SoundMap from './SoundMap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <Routes>
      <Route path ='/' element={<App />} />
      <Route path ='/Cyclesound' element={<Cyclesound />} />
      <Route path ='/CycleResult' element={<CycleResult />} />
      <Route path ='/Graph' element={<Graph />} />
      <Route path ='/SoundMap' element={<SoundMap />} />
    </Routes>
  </BrowserRouter>
);
