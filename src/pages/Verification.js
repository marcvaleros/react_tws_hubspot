import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Verification() {
  const navigate = useNavigate();
  const  {token} = useParams();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/auth/verification/${token}`);
        console.log(response);
        
        if(response && response.data.token){
          localStorage.setItem('authToken', response.data.token);
          navigate('/');
        }else{
          setError(true);
        }
      } catch (error) {
        // Handle the case for an expired or invalid magic link
        if (error.response && error.response.status === 400) {
          setError(true);
        } else {
          console.error('Error verifying magic link:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token,navigate]);


  return (
    <div className='bg-hs-orange min-h-screen flex flex-col space-y-4 justify-center items-center'>
        {isLoading ? (
        <>
          <img src="/Zach.png" alt='Loading...' height={100} width={100} className='animate-spin-slow hover:cursor-pointer self-center' />
          <span className='text-white'>Verifying your magic link. Please wait.</span>
        </>
      ) : error ? (
        <Link to='/magic-link-request' className='text-white underline'>
          Invalid or expired magic link. Please request a new one.
        </Link>
      ) : null}
    </div>
  )
}
