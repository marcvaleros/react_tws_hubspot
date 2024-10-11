import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import createApiInstance from '../utilities/apiAuth';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/dropdown';

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const api = createApiInstance(navigate);
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/list');
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  }, [navigate]);

 
  return (
      <div className='flex flex-col min-h-screen bg-hs-dark-gray space-y-8 '>
        <Navbar />
        <div className='max-w-7xl mx-auto flex flex-col p-4 justify-center items-center'>
          <h1 className='text-2xl text-hs-background my-2 self-center'>LIST OF USERS</h1>
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
                              Hubspot Key 
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Associated TWS
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
                              {user.franchisee?.hubspot_api_key ? user.franchisee.hubspot_api_key : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {
                              user.role === "agent" ? (
                                  <Dropdown franchisee={user.franchisee} user_id={user.id}/>
                              ) : null
                            }
                            
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
