import React, { useState, useEffect} from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { sendToServer, uploadInvalidContacts } from '../utilities/hubspot_import';
import Modal from '../components/modal';
import FilterModal from '../components/filterModal';
import LoadingSpinner from '../components/loadingSpinner';
import DisplayContactCounts from '../components/contactCount';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useFilter } from '../context/FilterContext';
import Navbar from '../components/navbar';


function Home() {
  const [fileData, setFileData] = useState(null);
  const [fileInfo, setFileInfo] = useState({ name: '', type: '' });
  const [filteredData, setFilteredData] = useState([]);
  const [invalidData, setInvalidData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayImportSummary,setDisplayImportSummary] = useState(false);
  const [gdriveLink, setGdriveLink] = useState(null);
  const [filterModal, toggleFilterModal] = useState(false);
  const {filters} = useFilter();


  useEffect(() => {
    if (loading) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [loading]);


  const initializeProjectsData = async (validContacts) => {
    const uniqueProjects = {};
    const projectsArray = [];

    validContacts.forEach((contact) => {
      const dealName = `${contact["Project Title"]}_${contact["Project ID"]}`;
      const descriptions =  `Project Title: ${contact["Project Title"]}\nProject Types: ${contact["Project Types"]}\nBuilding Uses: ${contact["Building Uses"]}\nProject Category: ${contact["Project Category"]}\nProject Description: ${contact["Project Description"]}\n
      `;

      if(!uniqueProjects[dealName]){
        uniqueProjects[dealName] = {
          'Project ID': contact["Project ID"],
          'Dealname': dealName,
          'Pipeline': "default",
          'Dealstage': "239936678",
          "Description": descriptions
        }
      }

    });

    for(const key in uniqueProjects){
      projectsArray.push(uniqueProjects[key]);
    }

    setProjectsData(projectsArray);
  }

  const initializeCompanyData = async (validContacts) => {
    const uniqueCompanies = {};
    const companyArray = [];

    validContacts.forEach((data) => {
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

  const filterCSV = async () => {
    const processed = new Set();
    const validContacts = [];
    const invalidContacts = [];
    const duplicateEmailContacts = [];
    
    const filtered = fileData.filter(raw => {
      const formattedPhone = raw.Phone ? raw.Phone.replace(/[-() ]/g, ''):'';
      raw.Phone = formattedPhone;
      let isValid = true;

      if(filters.zip){
        isValid = isValid && !filters.zipCodes.includes(raw.ZIP);
      }

      if(filters.projectType){
        isValid = isValid && !filters.projectTypes.includes(raw["Project Types"]);
      }

      if(filters.buildingUse){
        isValid = isValid && !filters.buildingUses.includes(raw["Building Uses"]);
      }

      return isValid;

    });

    filtered.forEach(contact => {
      const email = contact.Email;
      const project = `${contact["Project Title"]}_${contact["Project ID"]}`;

      const uniqueKey = `${email}_${project}`;

      if(!email){
        invalidContacts.push(contact);        //stored in the invalidContacts state
      }else if(processed.has(uniqueKey)) {
        duplicateEmailContacts.push(contact); //important to get the total number of duplicated emails in one project
      }else{
        validContacts.push(contact);          //stored in the filteredData state
        processed.add(uniqueKey);
      }
    })
    
    setFilteredData(validContacts);
    setInvalidData(invalidContacts);
    setDuplicateData(duplicateEmailContacts);
    initializeProjectsData(validContacts);
    initializeCompanyData(validContacts);    
    setIsFiltered(true);
  }

  const toggleModal  = (message) => {
    setModalOpen(prev => !prev);
    setModalMessage(message);
  }

  const handleModalFilter = () => {
    toggleFilterModal( prev => !prev);
  }

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const fileType = file?.type;

    if(file){
      setFileData([]);
      setFileInfo({ name: '', type: '' });
      setIsFiltered(false);
      setFilteredData([]);
      setCompanyData([]);
      setDisplayImportSummary(false);
      setGdriveLink(null);
      
      if(fileType === 'text/csv'){
        setFileInfo({ name: file.name, type: file.type });
        parseFile(file);
      }else if(fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        convertXLSXtoCSV(file);
      }
    }
  }

  const convertXLSXtoCSV = (file) =>{
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type : 'array'});
      const sheetName = workbook.SheetNames[1]; //access the second sheet
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      
      setFileInfo({ name: file.name.replace(/\.[^/.]+$/, ".csv"), type: "text/csv" });
      parseFile(csvData);
    };

    reader.readAsArrayBuffer(file);
  }

  const parseFile = (file) =>{
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setFileData(results.data);
        // console.log(`Results Data: ${JSON.stringify(results.data)}`);
      },
    });
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    const fileType = file.type;

    if(file){
      setFileData([]);
      setFileInfo({ name: '', type: '' });
      setIsFiltered(false);
      setFilteredData([]);
      setCompanyData([]);
      setDisplayImportSummary(false);
      setGdriveLink(null);
      
      if(fileType === 'text/csv'){
        setFileInfo({ name: file.name, type: file.type });
        parseFile(file);
      }else if(fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        convertXLSXtoCSV(file);
      }
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

  const importFile = async () => {
    try {
      const createCSVBlob = (data, columns) => {
        const csvData = Papa.unparse(data, {columns});
        return new Blob([csvData], {type: 'text/csv;charset=utf-8;' });
      }

      const contactBlob = createCSVBlob(filteredData, desiredColumns);
      const companyBlob = createCSVBlob(companyData, desiredCompanyColumn);
      const contactBlob2 = createCSVBlob(filteredData, desiredForImport);
      const projectBlob = createCSVBlob(projectsData, desiredProjectColumns);

      await sendToServer(fileInfo.name, contactBlob, companyBlob, contactBlob2, projectBlob, toggleModal, setLoading);
    
      if(invalidData.length > 0){
        const invalidContactBlob = createCSVBlob(invalidData, desiredColumns);
        const link = await uploadInvalidContacts(fileInfo.name, invalidContactBlob);
        console.log(`Gdrive link: ${link}`);
        setGdriveLink(link);
        setDisplayImportSummary(true);
      }else{
        console.log("There is nothing to upload to drive because there are no invalid contacts");
        setDisplayImportSummary(true);
      }

    } catch (error) {
      console.log(`Error processing files: ${error}`);
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
    saveAs(blob, `VALID_EMAILS_${fileInfo.name}`);
  }

  const downloadCompanyCSV = () => {
    const csvData = Papa.unparse(companyData,{ columns: desiredCompanyColumn });
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;'});
    saveAs(blob, `COMPANY_${fileInfo.name}`);
  }

  const downloadProjectCSV = () => {
    const csvData = Papa.unparse(projectsData,{ columns: desiredProjectColumns });
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;'});
    saveAs(blob, `PROJECT_${fileInfo.name}`);
  }

  const desiredProjectColumns = ["Project ID","Dealname",  "Description", "Pipeline", "Dealstage"];
  const desiredForImport = ["Name", "Role", "Phone", "Email", "Website", "Address", "City", "State", "ZIP"]; 

  const desiredColumns = ["Project ID", "Name", "Project Title", "Role", "Company", "Phone", "Email", "Website","Project Description", "Building Uses", "Project Types", "Project Category","Address", "City", "State", "ZIP"];

  const desiredCompanyColumn = ["Company", "Website", "Domain"];  

  //san gabriel valley zips
  // const zip_codes = [
  //   "91001", "91006", "91007", "91008", "91010", "91016", "91024", "91107", "91706", "91775", "91776", 
  //   "91780", "91702", "91711", "91722", "91723", "91724", "91740", "91741", "91750", "91766", "91767", 
  //   "91768", "91773", "91790", "91791", "91701", "91710", "91730", "91737", "91761", "91762", "91763", 
  //   "91764", "91784", "91786", "91739", "92313", "92316", "92324", "92335", "92336", "92337", "92346", 
  //   "92350", "92354", "92359", "92369", "92373", "92374", "92376", "92377", "92401", "92404", "92405", 
  //   "92407", "92408", "92410", "92411", "92415"
  // ]; 

  //san fernando valley zips
  // const zip_codes = [
  //   "91401", "91403", "91405", "91411", "91423", "91601", "91602", "91604", "91605", "91606", "91607",
  //   "91040", "91042", "91311", "91324", "91325", "91326", "91330", "91331", "91340", "91342", "91343", 
  //   "91344", "91345", "91352", "91402", "91301", "91302", "91303", "91304", "91306", "91307", "91367", 
  //   "91371", "91377", "93063", "93064", "91316", "91335", "91356", "91364", "91406", "91436", "91011", 
  //   "91020", "91046", "91201", "91202", "91203", "91207", "91208", "91214", "91501", "91502", "91504", 
  //   "91505", "91506"
  // ];

  return (
    <>
      { loading && (
        <div className="fixed inset-0 bg-hs-light-gray bg-opacity-90 flex justify-center items-center z-50">
          <div className="flex flex-col text-center">
            <img src="/Zach.png" alt='' height={150} width={150} className='animate-spin-slow hover:cursor-pointer self-center' />
            <LoadingSpinner className='justify-center items-center '/>
          </div>
        </div>
      )}
      <div>
        <Navbar/>
        <div className="max-w-7xl h-[500px] mx-auto bg-hs-background mt-12">

          <div className="flex flex-col justify-center items-center">
            <h4 className='text-hs-orange text-sm sm:text-sm md:text-sm lg:text-xl'>IMPORT CONSTRUCT CONNECT FILE TO HUBSPOT</h4>
          </div>

            {/* file upload component  */}
          <div className="mx-16 my-2" onDrop={handleDrop} onDragOver={handleDragOver}>
            <label
                className="flex justify-center w-full h-[300px] transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-hs-dark-blue focus:outline-none hover:bg-blue-50">
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
                <input type="file" name="file_upload" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
            
              <div className='flex flex-row justify-center items-center gap-2 m-4'>
            
                <button 
                  onClick={handleModalFilter}
                  className={`flex flex-row justify-center items-center gap-2 bg-hs-blue p-4 rounded-md text-hs-background hover:bg-hs-dark-blue `}
                  >
                    <AdjustmentsHorizontalIcon className='h-6 w-6'/>
                    <p className='font-hs-font'>Filter Settings</p>
                </button>

                <button 
                  onClick={filterCSV}
                  className={`bg-hs-light-gray p-4 rounded-md text-hs-background hover:bg-hs-dark-gray ${!fileData ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!fileData}
                  >
                    <p className='font-hs-font'>Filter File</p>
                </button>

                <button 
                  className={`bg-hs-orange-light p-4 rounded-md text-hs-background hover:bg-hs-orange ${!isFiltered ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  onClick={importFile} 
                  disabled={!isFiltered}>
                  <p className='font-hs-font'>Import File to TWS Hubspot</p>
                </button>
              </div>

              {isFiltered && (
                <>
                  <div className='flex flex-row gap-2 justify-center items-center'>
                  <button onClick={downloadCompanyCSV} className='flex items-center bg-green-100 text-green-900 p-2 rounded-lg border-green-700 border-2 hover:bg-green-700 hover:text-white transition ease-in-out'>
                    <img src="/gsheets_logo.png" height={15} width={20} alt='' className='mr-2' /> Download Companies CSV
                  </button>
                  <button onClick={downloadFilteredCSV} className='flex items-center bg-green-100 text-green-900 p-2 rounded-lg border-green-700 border-2 hover:bg-green-700 hover:text-white transition ease-in-out'>
                    <img src="/gsheets_logo.png" height={15} width={20} alt='' className='mr-2' /> Download Contacts with Emails CSV
                  </button>
                  <button onClick={downloadProjectCSV} className='flex items-center bg-green-100 text-green-900 p-2 rounded-lg border-green-700 border-2 hover:bg-green-700 hover:text-white transition ease-in-out'>
                    <img src="/gsheets_logo.png" height={15} width={20} alt='' className='mr-2' /> Download Projects CSV
                  </button>
                  
                  </div>
                    { displayImportSummary && (
                      <DisplayContactCounts
                        link={gdriveLink}
                        validContacts={filteredData}
                        invalidContacts={invalidData}
                        duplicateEmailContacts={duplicateData}
                    />
                    )
                    }
                </>
              )}
        </div>
        
          {filteredData.length > 0 && (
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
            )
          }

          {isModalOpen && (
            <Modal toggleModal={toggleModal} message={modalMessage}>
            </Modal>
          ) 
          }

          {filterModal && (
            <FilterModal toggleModal={handleModalFilter}></FilterModal>
          )}
      </div>
    
    </>
  );
}

export default Home;
