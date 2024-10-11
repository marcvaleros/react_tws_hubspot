import axios from 'axios';
import isTokenExpired from './checkTokenExpiration';

const createApiInstance = (navigate) => {
  
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}api/auth`,
  });
  
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      
      if(!isTokenExpired(token)){
        config.headers['Authorization'] = `Bearer ${token}`;
      }else{
        //remove jwt and redirect to homepage?
        localStorage.removeItem('authToken');
        navigate('/magic-link-request');
        // throw new axios.Cancel('Token expired');
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
  
}

export default createApiInstance;