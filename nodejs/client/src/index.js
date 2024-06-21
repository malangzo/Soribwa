import React from 'react';
import { render } from 'react-dom';
import App from "./App";
import Cyclesound from "./Cyclesound";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const rootElement = document.getElementById('root');
render(
  <BrowserRouter>
    <Routes>
      <Route path ='/' element={<App />} />
      <Route path ='/Cyclesound' element={<Cyclesound />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
