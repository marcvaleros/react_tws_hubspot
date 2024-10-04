import './App.css';
import React from 'react';
import {Routes, Route ,useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import VerificationPage from './pages/Verification';

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.key}>
      <Route path='/' element={<Home/>} />
      <Route path='/magic-link-request' element={<Login />} />
      <Route path='/auth/login/:token' element={<VerificationPage/>} />
    </Routes>
  );
}

export default App;
