import './App.css';
import React, { useState} from 'react';
import Papa from 'papaparse';

function App() {
  const [fileData, setFileData] = useState([]);
  const [fileInfo, setFileInfo] = useState({ name: '', type: '' });

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if(file){
      setFileData([]);
      setFileInfo({ name: '', type: '' });

      setFileInfo({ name: file.name, type: file.type });
      parseFile(file);
    }
  }

  const parseFile = (file) =>{
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setFileData(results.data);
        console.log("Parsed CSV data:", results.data);
      },
    });
  }


  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileData([]);
      setFileInfo({ name: '', type: '' });
      setFileInfo({ name: file.name, type: file.type });
      parseFile(file);
    }
  }


  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  const desiredColumns = [
    "Name", "Project Title", "Role", "Company", "Phone", "Email", "Website",
    "Project Description", "Building Uses", "Project Types", "Project Category",
    "Address", "City", "State", "ZIP"];

  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-center bg-hs-background ">
        <h1>
          Welcome to TWS Automation. Please upload a raw file format to apply filters (ONLY ACCEPTS CSV FILE FORMAT)
        </h1>
        <div className="container m-6 px-[100px]" onDrop={handleDrop} onDragOver={handleDragOver}>
          <label
              className="flex justify-center w-full h-[300px] transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none hover:bg-hs-gray">
              <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium text-gray-600">
                      Drop files to upload, or
                      <span className="text-blue-600 underline"> browse</span>
                  </span>
              </span>
              <input type="file" name="file_upload" accept=".csv" className="hidden" onChange={handleFileChange} />
          </label>
      </div>
      <div className="bg-green-100 text-green-900 p-4 rounded-lg border-green-700 border-2">
          <p>Filename: {fileInfo.name || 'No file selected'}</p>
      </div>
        <div className='flex flex-row justify-between items-center gap-2 m-4'>
          <button className='bg-hs-dark-gray p-4 rounded-md text-hs-background hover:bg-hs-light-gray'>
            <p className='font-hs-font'>Convert Raw to Final Format</p>
          </button>
          <button className='bg-hs-orange p-4 rounded-md text-hs-background hover:bg-hs-orange-light'>
            <p className='font-hs-font'>Import File to Hubspot</p>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto p-4 max-h-[500px]">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200 text-[10px]">
            <thead className="bg-gray-100">
          <tr>
            {desiredColumns.map((column) => (
              <th key={column} className=" py-1 border-b text-left whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
            </thead>
            <tbody>
          {fileData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {desiredColumns.map((column) => (
                <td
                  key={column}
                  className="px-2 py-1 border-b max-w-[100px] overflow-hidden text-ellipsis whitespace-normal break-words"
                  title={row[column] || ''}
                >
                  {truncateText(row[column] || '', 10)}
                </td>
              ))}
            </tr>
          ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

export default App;
