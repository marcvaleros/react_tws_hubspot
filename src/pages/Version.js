import React from 'react';
import Navbar from '../components/navbar';
import Accordion from '../components/accordion';

export default function Version() {
  return (
    <div className='flex flex-col min-h-screen bg-hs-dark-gray'>
      <Navbar />
      <Accordion/>   
    </div>
  )
}
