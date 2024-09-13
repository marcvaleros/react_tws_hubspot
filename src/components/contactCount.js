import React from 'react';

const DisplayContactCounts = ({ validContacts, invalidContacts, duplicateEmailContacts, link }) => {
  return (
    <div className="container m-6 px-[100px]">
      <div className="text-center mb-8 rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4 text-hs-orange">Import Summary</h1>
        <div className="flex justify-center space-x-4">
          <div className="flex flex-row gap-2 justify-center items-center bg-green-100 text-green-600 p-4 rounded-lg">
            <p className="text-2xl rounded-md bg-white px-4 py-2">{validContacts?.length || 0}</p>
            <h2 className="text-xl font-semibold">Valid Contacts</h2>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center bg-red-100 text-red-500 p-4 rounded-lg">
            <p className="text-2xl rounded-md bg-white px-4 py-2">{invalidContacts?.length || 0}</p>
            <h2 className="text-xl font-semibold">Invalid Contacts</h2>
            {
              link != null && (
                <a href={link} target='_blank' rel="noopener noreferrer" className='text-blue-600 underline'>Link to Gdrive</a>
              )
            }
          </div>
          <div className="flex flex-row gap-2 justify-center items-center bg-yellow-100 text-yellow-600 p-4 rounded-lg">
            <p className="text-2xl rounded-md bg-white px-4 py-2">{duplicateEmailContacts?.length || 0}</p>
            <h2 className="text-xl font-semibold">Duplicate Emails</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayContactCounts;