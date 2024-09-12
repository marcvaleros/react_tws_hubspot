import React from 'react';

const DisplayContactCounts = ({ validContacts, invalidContacts, duplicateEmailContacts }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-hs-orange">Import Summary</h1>
        <div className="flex justify-center space-x-8">
          <div className="bg-green-100 text-green-600 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Valid Contacts</h2>
            <p className="text-2xl">{validContacts?.length || 0}</p>
          </div>
          <div className="bg-red-100 text-red-500 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Invalid Contacts</h2>
            <p className="text-2xl">{invalidContacts?.length || 0}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Duplicate Emails</h2>
            <p className="text-2xl">{duplicateEmailContacts?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayContactCounts;