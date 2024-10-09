import React, {useEffect} from 'react'
import Navbar from '../components/navbar'
import { useFranchisee } from '../context/FranchiseeContext';

export default function TWSFranchisee() {
  const {franchisees, selectedFranchisee, handleRowSelect} = useFranchisee();

  useEffect(() => {
    const storedFranchisee = JSON.parse(localStorage.getItem('selectedFranchisee'));
    if (storedFranchisee) {
      handleRowSelect(storedFranchisee);
    }
  }, []);

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
                      </tr>
                  </thead>
                  <tbody>
                    { franchisees.length > 0 && 
                      franchisees.map((franchisee, index) => (
                        <tr onClick={() => handleRowSelect(franchisee)} key={index}  className={`bg-hs-background  text-hs-dark-gray ${(selectedFranchisee.id === franchisee.id)  ? 'bg-hs-dark-blue text-white hover:bg-hs-dark-blue' : 'hover:bg-hs-gray'}`}>
                          <th scope="row" className="px-6 py-4 whitespace-nowrap ">
                              {franchisee.owner}
                          </th>
                          <td className="px-6 py-4">
                              {franchisee.name}
                          </td>
                          <td className="px-6 py-4">
                              {franchisee.hubspot_api_key ? franchisee.hubspot_api_key : 'N/A' }
                          </td>
                          <td className="px-6 py-4">
                              {
                                franchisee.users.length > 0 ? 
                                franchisee.users.map((user, index) => (
                                  <span key={index}>{user.email}</span>
                                )) :
                                "N/A"
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
