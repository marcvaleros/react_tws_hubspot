import React, { useEffect } from 'react';
import MagicLinkRequest from '../components/magicLinkRequest';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(()=>{
    const authToken = localStorage.getItem('authToken');
    if(authToken) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='flex flex-row justify-center items-center min-h-screen bg-hs-background text-white'>
      <MagicLinkRequest/>
    </div>
  )
}
