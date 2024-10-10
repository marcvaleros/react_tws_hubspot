import React from 'react'
import { FilterProvider } from '../context/FilterContext';
import { UserProvider } from '../context/UserContext';
import { FranchiseeProvider } from '../context/FranchiseeContext';
// import { ThemeProvider } from "@material-tailwind/react";


export default function Providers({children}) {
  return (
    <FilterProvider>
        <FranchiseeProvider>
          <UserProvider>
            {/* <ThemeProvider> */}
            {children}
            {/* </ThemeProvider> */}
          </UserProvider>
        </FranchiseeProvider>
      </FilterProvider>
  )
}
