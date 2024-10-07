import React from 'react';
import {Navigate} from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  console.log(`This is the token: ${token}`);

  if(!token) return false;

  const decodedToken = JSON.parse(atob(token.split('.')[1])); 
  const currentTime = Date.now() / 1000; 

  if(decodedToken.exp < currentTime){
    console.warn('Token has expired. Please request a new magic link.');
    return false;
  }

  return true;
}

const ProtectedRoute = ({element: Component, ...rest}) => {
  return isAuthenticated() ? (
    <Component {...rest} />
  ): (
    <Navigate to="/magic-link-request" replace />
  );
}

export default ProtectedRoute;

