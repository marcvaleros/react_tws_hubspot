import './App.css';
import React, { useState} from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import {importToHubspot, sendToServer} from './utilities/hubspot_import';
import Modal from './components/modal';

function App() {
  const [fileData, setFileData] = useState(null);
  const [fileInfo, setFileInfo] = useState({ name: '', type: '' });
  const [filteredData, setFilteredData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const toggleModal  = (message) => {
    setModalOpen(prev => !prev);
    setModalMessage(message);
  }

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if(file){
      setFileData([]);
      setFileInfo({ name: '', type: '' });
      setIsFiltered(false); 
      setCompanyData([]);

      setFileInfo({ name: file.name, type: file.type });
      parseFile(file);
    }
  }

  const parseFile = (file) =>{
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setFileData(results.data);
        // console.log("Parsed CSV data:", results.data);
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
      setIsFiltered(false);
      setCompanyData([]);

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

  const filterCSV = () => {
    const filtered = fileData.filter(raw => zip_codes.includes(raw.ZIP));
    setFilteredData(filtered);
    setIsFiltered(true);

    const uniqueCompanies = {};
    const companyArray = [];

    filtered.forEach((data) => {
      const domain = getDomainName(data.Email, data.Website);
      const companyName = data.Company;
      const website = data.Website;
      const email = data.Email;

      if(!uniqueCompanies[companyName]){
        uniqueCompanies[companyName] = {
          Company: companyName,
          Website: website,
          Domain: domain,
        }
      }else if (email || website){
        uniqueCompanies[companyName] = {
          Company: companyName,
          Website: website,
          Domain: domain,
        };
      }
    });
    
    for(const key in uniqueCompanies){
      companyArray.push(uniqueCompanies[key]);
    }

    setCompanyData(companyArray);
  }

  const importFile = async () => {
    try {
      // const csvContactData = Papa.unparse(filteredData,{ columns: desiredColumns });
      // const csvCompanyData = Papa.unparse(companyData,{ columns: desiredCompanyColumn });

      // console.log(`Contacts data: ${filteredData}`);
      // console.log(`Company data: ${companyData}`);
      
      // const contactBlob = new Blob([csvContactData], { type: 'text/csv;charset=utf-8;'});
      // const companyBlob = new Blob([csvCompanyData], { type: 'text/csv;charset=utf-8;'});
      // const res = await importToHubspot(fileInfo.name, contactBlob, companyBlob, toggleModal); 
      
      // console.log(`filtered data: ${filteredData}`);
      await sendToServer(filteredData, companyData); 
    } catch (error) {
      console.log("Error Detected", error);
      
    }
  }

  const getDomainName = (email, website) => {
    const getDomainFromEmail = (email) => {
      return email.substring(email.indexOf("@") + 1);
    };
  
    const getDomainFromWebsite = (website) => {
      const domain = website.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/i);
      return domain ? domain[1] : '';
    };
  
    if (email) {
      return getDomainFromEmail(email);
    } else if (website) {
      return getDomainFromWebsite(website);
    } else {
      return ''; 
    }
  };

  const downloadFilteredCSV = () => {
    const csvData = Papa.unparse(filteredData,{ columns: desiredColumns });
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;'});
    saveAs(blob, `FINAL_${fileInfo.name}`);
  }

  const downloadCompanyCSV = () => {
    const csvData = Papa.unparse(companyData,{ columns: desiredCompanyColumn });
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;'});
    saveAs(blob, `COMPANY_${fileInfo.name}`);
  }



  const desiredColumns = ["Name", "Project Title", "Role", "Company", "Phone", "Email", "Website","Project Description", "Building Uses", "Project Types", "Project Category","Address", "City", "State", "ZIP"];

  const desiredCompanyColumn = ["Company", "Website", "Domain"];  

  const zip_codes = [
    "90002", "90027", "90028", "90038", "90046", "90048", "90049", "90059", "90061",
    "90068", "90069", "90073", "90077", "90201", "90210", "90211", "90212", "90220",
    "90221", "90222", "90240", "90241", "90242", "90262", "90263", "90265", "90270",
    "90272", "90274", "90275", "90280", "90290", "90401", "90402", "90403", "90404",
    "90501", "90502", "90503", "90505", "90601", "90602", "90603", "90604", "90605",
    "90606", "90631", "90640", "90650", "90660", "90670", "90701", "90706", "90710",
    "90712", "90713", "90717", "90723", "90732", "90744", "90745", "90746", "90747",
    "90755", "90805", "90806", "90807", "90810", "91011", "91020", "91040", "91042",
    "91046", "91201", "91202", "91203", "91207", "91208", "91214", "91311", "91320",
    "91321", "91324", "91325", "91326", "91330", "91331", "91340", "91342", "91343",
    "91344", "91345", "91350", "91351", "91352", "91354", "91355", "91360", "91361",
    "91362", "91381", "91387", "91390", "91401", "91402", "91403", "91405", "91411",
    "91423", "91501", "91502", "91504", "91505", "91506", "91601", "91602", "91604",
    "91605", "91606", "91607", "91608", "91731", "91732", "91733", "91744", "91745",
    "91746", "91748", "91755", "91770", "91789", "91792", "92821", "93010", "93012",
    "93033", "93041", "93042", "93043", "93065", "93510", "93532", "93534", "93535",
    "93536", "93543", "93550", "93551", "93552", "93553", "93560", "93563", "92683",
    "92804", "92704", "92805", "90631", "92801", "92703", "92677", "92630", "92627",
    "92647", "92530", "92780", "92708", "92620", "92707", "92646", "92618", "92840",
    "92870", "92833", "92656", "92626", "92705", "92701", "90630", "92843", "92886",
    "90620", "92691", "92692", "92821", "92648", "92688", "92867", "92802", "92806",
    "92807", "92675", "92679", "92831", "92649", "92672", "92841", "92869", "90621",
    "92660", "92706", "92883", "92612", "92602", "92673", "92604", "92653", "92835",
    "92614", "92868", "90680", "92629", "92782", "92694", "92606", "90740", "92832",
    "92651", "92844", "90720", "92663", "92887", "92865", "92808", "92603", "92637",
    "92617", "92845", "92866", "90623", "92625", "92610", "92657", "92861", "92624",
    "92655", "92823", "92676", "92661", "92662", "92697", "92698", "92710", "92725",
    "92863", "92628", "92616", "92619", "92678", "92684", "92799", "92822", "92857",
    "92871", "90633", "92709", "92623", "92650", "92652", "92654", "92659", "92658",
    "92674", "92685", "92690", "92693", "92702", "92711", "92712", "92735", "92728",
    "92781", "92803", "92811", "92809", "92814", "92812", "92816", "92815", "92817",
    "92825", "92834", "92837", "92836", "92838", "92842", "92846", "92856", "92850",
    "92859", "92862", "92864", "92885", "92899", "90622", "90624", "90632", "90721",
    "90743", "90742", "92605", "92609", "92607", "92615"
  ];

  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-center bg-hs-background ">
        <h1 className='text-lg text-hs-orange uppercase'>
          Please upload a raw file to convert to final file (ONLY ACCEPTS CSV FILE FORMAT)
        </h1>
        <div className="container m-6 px-[100px]" onDrop={handleDrop} onDragOver={handleDragOver}>
          <label
              className="flex justify-center w-full h-[300px] transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none hover:bg-hs-gray">
              <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="font-medium text-gray-600">
                      Drop files to upload, or
                      <span className="text-blue-600 underline"> browse</span>
                    <p className='text-hs-dark-gray'>{fileInfo.name || 'No file selected'}</p>
                  </div>
                  <div>
                  </div>
              </div>
              <input type="file" name="file_upload" accept=".csv" className="hidden" onChange={handleFileChange} />
          </label>
      </div>
   
            <div className='flex flex-row justify-between items-center gap-2 m-4'>
          
              <button 
                className={`bg-hs-dark-gray p-4 rounded-md text-hs-background hover:bg-hs-light-gray ${isFiltered || !fileData ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={filterCSV}
                disabled={isFiltered || !fileData}
                >
                  <p className='font-hs-font'>Filter File</p>
              </button>
              <button 
                className={`bg-hs-orange p-4 rounded-md text-hs-background hover:bg-hs-orange-light ${!isFiltered ? 'opacity-50 cursor-not-allowed' : ''}`} 
                onClick={importFile} 
                disabled={!isFiltered}>
                <p className='font-hs-font'>Import File to TWS Hubspot</p>
              </button>
            </div>

            {isFiltered && (
              <div className='flex flex-row gap-2'>
                <button onClick={downloadCompanyCSV} className='bg-green-100 text-green-900 p-4 rounded-lg border-green-700 border-2 hover:bg-green-700 hover:text-white transition ease-in-out'>Download Associated Company CSV</button>
                <button onClick={downloadFilteredCSV} className='bg-green-100 text-green-900 p-4 rounded-lg border-green-700 border-2 hover:bg-green-700 hover:text-white transition ease-in-out'>Download Final Contacts CSV</button>
              </div>
            )}
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
          {filteredData.map((row, index) => (
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

        {isModalOpen && (
          <Modal toggleModal={toggleModal} message={modalMessage}>
          </Modal>
        ) 
      
      }
    </div>
  );
}

export default App;
