import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import createApiInstance from '../utilities/apiAuth';
import { useNavigate, useNavigation } from 'react-router-dom';
import Card from '../components/card';

export default function TWSFranchisee() {
  const navigate = useNavigate();
  const [franchisees, setFranchisees] = useState([]);
  const api = createApiInstance(navigate);

  useEffect(() => {
    const fetchFranchisees = async () => {
      try {
        const res = await api.get('/franchisees/list');
        console.log(JSON.stringify(res.data, null, 2));
        setFranchisees(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFranchisees();
  }, []);

 
  return (
      <>
        <Navbar/>
          <div className='flex flex-col justify-center items-center  bg-hs-background'>
            <h1 className='text-2xl text-hs-dark-blue my-2'>These are the list of franchisees.</h1>
            <div className='flex flex-row justify-center items-center gap-2 cursor-pointer'>
              {
                franchisees.map((franchisee, index) => (
                  <Card props={franchisee}/>
                ))
              }
            </div>
          </div>
      </>
  )
}
