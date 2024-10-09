import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import createApiInstance from '../utilities/apiAuth';
import { useNavigate } from 'react-router-dom';

export default function TWSFranchisee() {
  const navigate = useNavigate();
  const [franchisees, setFranchisees] = useState([]);
  
  useEffect(() => {
    const api = createApiInstance(navigate);
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
  }, [navigate]);

 
  return (
      <div className='flex flex-col min-h-screen bg-hs-background space-y-8 '>
        <Navbar />
        <div className='max-w-7xl mx-auto flex flex-col p-4 justify-center items-center'>
          <h1 className='text-2xl text-hs-dark-blue my-2 self-center'>LIST OF TWS FRANCHISEES</h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-12">
              <table className="w-full text-sm text-left rtl:text-right text-white cursor-pointer">
                  <thead className="text-xs text-hs-background uppercase bg-hs-light-gray ">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Owner
                          </th>
                          <th scope="col" className="px-6 py-3">
                              TWS Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Hubspot API Key
                          </th>
                          <th scope="col" className="px-6 py-3">
                              SDR Assigned 
                          </th>
                          <th scope="col" className="px-6 py-3">
                              <span className="sr-only">Edit</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    {
                      franchisees.map((franchisee, index) => (
                        <tr key={index} className=" bg-hs-background  hover:bg-hs-gray text-hs-dark-gray">
                          <th scope="row" className="px-6 py-4 whitespace-nowrap ">
                              {franchisee.owner}
                          </th>
                          <td className="px-6 py-4">
                              {franchisee.name}
                          </td>
                          <td className="px-6 py-4">
                              {franchisee.hubspot_api_key}
                          </td>
                          <td className="px-6 py-4">
                              {franchisee.createdAt}
                          </td>
                          <td className="px-6 py-4 text-right">
                              {/* <a href="/tws_franchisee" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                          </td>
                        </tr>
                      ))
                    }
                    
                      
                  </tbody>
              </table>
          </div>
        </div>
      </div>
  )
}
