import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import createApiInstance from '../utilities/apiAuth';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const api = createApiInstance(navigate);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/list');
        console.log(JSON.stringify(res.data, null, 2));
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  });

 
  return (
      <div className='flex flex-col min-h-screen bg-hs-background space-y-8 '>
        <Navbar />
        <div className='max-w-7xl mx-auto flex flex-col p-4 justify-center items-center'>
          <h1 className='text-2xl text-hs-dark-blue my-2 self-center'>LIST OF USERS/SDR</h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-12">
              <table className="w-full text-sm text-left rtl:text-right text-white cursor-pointer">
                  <thead className="text-xs text-hs-background uppercase bg-hs-light-gray ">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Email
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Role
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Associated TWS
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Hubspot Key 
                          </th>
                          <th scope="col" className="px-6 py-3">
                              <span className="sr-only">Assign to Franchisee</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    {
                      users.map((user, index) => (
                        <tr key={index} className=" bg-hs-background  hover:bg-hs-gray text-hs-dark-gray">
                          <th scope="row" className="px-6 py-4 whitespace-nowrap ">
                              {user.email}
                          </th>
                          <td className="px-6 py-4">
                              {user.role}
                          </td>
                          <td className="px-6 py-4">
                              {user.franchisee?.name ? user.franchisee.name : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                              {user.franchisee?.hubspot_api_key ? user.franchisee.hubspot_api_key : 'N/A'}
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
