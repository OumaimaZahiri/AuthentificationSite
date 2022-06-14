import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Home from '../Home/Home';
import useToken from './useToken';


function App() {

  return (
    <div className="wrapper">
      <BrowserRouter>
         <Routes>
         <Route path='/' element={<Login/>} />
         <Route path='/home' element={<Home/>} />
         <Route path='/register' element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
