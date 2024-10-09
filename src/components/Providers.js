import React from 'react'
import { FilterProvider } from '../context/FilterContext'
import { UserProvider } from '../context/UserContext'


export default function Providers({children}) {
  return (
    <FilterProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </FilterProvider>
  )
}
