import React from 'react'
import { FilterProvider } from '../context/FilterContext';
import { UserProvider } from '../context/UserContext';
import { FranchiseeProvider } from '../context/FranchiseeContext';


export default function Providers({children}) {
  return (
    <FranchiseeProvider>
      <FilterProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </FilterProvider>
    </FranchiseeProvider>
  )
}
