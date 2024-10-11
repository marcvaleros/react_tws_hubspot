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
     // eslint-disable-next-line
  }, []);

  return (
      <div className='flex flex-col min-h-screen bg-hs-dark-gray space-y-8 '>
        <Navbar />
        <div className='max-w-7xl mx-auto flex flex-col p-4 justify-center items-center'>
          <h1 className='text-2xl text-hs-background my-2 self-center'>LIST OF TWS FRANCHISEES</h1>
          <div className="relative overflow-x-auto shadow-lg sm:rounded-lg mx-12">
              <table className="w-full  text-sm text-left rtl:text-right text-white cursor-pointer">
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
                              Zips
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    { franchisees.length > 0 && 
                      franchisees.map((franchisee, index) => (
                        <tr onClick={() => handleRowSelect(franchisee)} key={index}  className={`bg-hs-background  text-hs-dark-gray ${(selectedFranchisee.id === franchisee.id)  ? 'bg-hs-orange text-white hover:bg-hs-orange' : 'hover:bg-hs-gray'}`}>
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
                                  <p key={index}>{user.email}</p>
                                )) :
                                "N/A"
                              }
                          </td>

                          <td className="px-6 py-4 text-sm">
                          {franchisee.settings ? 
                            (franchisee.settings.zips.length > 20 
                              ? franchisee.settings.zips.slice(0, 20) + '...' 
                              : franchisee.settings.zips) 
                            : 'N/A'}
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
