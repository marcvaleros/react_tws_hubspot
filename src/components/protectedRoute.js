import React from 'react';
import {Navigate} from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');

  if(!token) return { isAuthenticated: false };

  const decodedToken = JSON.parse(atob(token.split('.')[1])); 
  const currentTime = Date.now() / 1000; 

  if(decodedToken.exp < currentTime){
    console.warn('Token has expired. Please request a new magic link.');
    return { isAuthenticated: false };
  }

  return { isAuthenticated: true, role: decodedToken.role };
}

const ProtectedRoute = ({element: Component,requiredRole, ...rest}) => {
  const { isAuthenticated: auth, role} = isAuthenticated();

  if(!auth){
    return <Navigate to="/magic-link-request" replace />
  }

  if(requiredRole && role !== requiredRole ){
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
}

export default ProtectedRoute;

