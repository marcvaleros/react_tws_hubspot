import './App.css';
import React from 'react';
import {Routes, Route ,useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import VerificationPage from './pages/Verification';
import ProtectedRoute from './components/protectedRoute';
import NotFound from './pages/NotFound';
import TWSFranchisee from './pages/TWSFranchisee';
import UserList from './pages/UserList';
import Version from './pages/Version';

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.key}>
      {/* Protected route for authenticated users, if the token expires it will redirect to magiclink request page  */}
      <Route path='/' element={<ProtectedRoute element={Home}/>} />
      <Route path='/tws_franchisee' element={<ProtectedRoute element={TWSFranchisee} requiredRole={"admin"} />} />
      <Route path='/users' element={<ProtectedRoute element={UserList} requiredRole={"admin"}/>} />
      <Route path='/version' element={<ProtectedRoute element={Version}/>} />

      {/* Public Routes  */}
      <Route path='/magic-link-request' element={<Login />} />
      <Route path='/auth/login/:token' element={<VerificationPage/>} />

      {/* 404 Routes  */}
      <Route path='/404' element={ <NotFound/> } />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;
