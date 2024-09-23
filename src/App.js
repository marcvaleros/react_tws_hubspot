import './App.css';
import React, { useState, useEffect} from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { sendToServer, uploadInvalidContacts } from './utilities/hubspot_import';
import Modal from './components/modal';
import LoadingSpinner from './components/loadingSpinner';
import DisplayContactCounts from './components/contactCount';

function App() {
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
    return zip_codes.includes(raw.ZIP)
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

    // console.log(`Contacts with valid email: ${validContacts.length}`);
    // console.log(`Contacts with invalid email: ${invalidContacts.length}`);
    // console.log(`Contacts with duplicate email: ${duplicateEmailContacts.length}`);
    
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

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if(file){
      setFileData([]);
      setFileInfo({ name: '', type: '' });
      setIsFiltered(false);
      setFilteredData([]);
      setCompanyData([]);
      setDisplayImportSummary(false);
      setGdriveLink(null);

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
      setFilteredData([]);
      setCompanyData([]);
      setDisplayImportSummary(false);
      setGdriveLink(null);

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

  const zip_codes = [
    "90027", "90263", "91321", "90049", "91401", "91040", "91344", "91301", "91316", "91011",
    "91504", "91402", "90028", "90265", "91350", "90073", "91403", "91042", "91345", "91302",
    "91335", "91020", "91505", "90038", "90272", "91351", "90077", "91405", "91311", "91352",
    "91303", "91356", "91046", "91506", "90046", "90290", "91354", "90210", "91411", "91324",
    "91402", "91304", "91364", "91201", "90048", "90402", "91355", "90211", "91423", "91325",
    "91306", "91406", "91202", "90068", "90403", "91360", "90212", "91601", "91326", "91307",
    "91436", "91203", "90069", "91320", "91362", "90401", "91602", "91330", "91367", "91207",
    "90069", "91320", "91362", "90401", "91602", "91330", "91367", "91207", "91608", "91361",
    "91381", "90404", "91604", "91331", "91371", "91208", "93010", "91384", "91605", "91340",
    "91377", "91214", "93012", "91387", "91606", "91342", "93063", "91501", "93030", "91390",
    "91607", "91343", "93064", "91502", "93033", "93035", "93036", "93041", "93042", "93043",
    "93015", "93021", "93040", "93065", "93066", "93510", "92683", "92804", "92704", "92805",
    "90631", "92801", "92703", "92677", "92630", "92627", "92647", "92530", "92780", "92708",
    "92620", "92707", "92646", "92618", "92840", "92870", "92833", "92656", "92626", "92705",
    "92701", "90630", "92843", "92886", "90620", "92691", "92692", "92821", "92648", "92688",
    "92867", "92802", "92806", "92807", "92675", "92679", "92831", "92649", "92672", "92841",
    "92869", "90621", "92660", "92706", "92883", "92612", "92602", "92673", "92604", "92653",
    "92835", "92614", "92868", "90680", "92629", "92782", "92694", "92606", "90740", "92832",
    "92651", "92844", "90720", "92663", "92887", "92865", "92808", "92603", "92637", "92617",
    "92845", "92866", "90623", "92625", "92610", "92657", "92861", "92624", "92655", "92823",
    "92676", "92661", "92662", "92697", "92698", "92710", "92725", "92863", "92628", "92616",
    "92619", "92678", "92684", "92799", "92822", "92857", "92871", "90633", "92709", "92623",
    "92650", "92652", "92654", "92659", "92658", "92674", "92685", "92690", "92693", "92702",
    "92711", "92712", "92735", "92728", "92781", "92803", "92811", "92809", "92814", "92812",
    "92816", "92815", "92817", "92825", "92834", "92837", "92836", "92838", "92842", "92846",
    "92856", "92850", "92859", "92862", "92864", "92885", "92899", "90622", "90624", "90632",
    "90721", "90743", "90742", "92605", "92609", "92607", "92615", "90245", "90002", "90059",
    "90061", "90201", "90201", "90220", "90221", "90222", "90240", "90240", "90241", "90241",
    "90242", "90247", "90248", "90249", "90250", "90254", "90260", "90262", "90266", "90270",
    "90270", "90274", "90275", "90277", "90278", "90280", "90501", "90502", "90503", "90504",
    "90505", "90506", "90601", "90601", "90602", "90602", "90603", "90604", "90605", "90606",
    "90606", "90631", "90640", "90640", "90650", "90660", "90660", "90670", "90670", "90701",
    "90706", "90710", "90712", "90713", "90717", "90723", "90732", "90744", "90745", "90746",
    "90747", "90755", "90805", "90806", "90807", "90810", "91708", "91709", "91731", "91731",
    "91732", "91732", "91733", "91733", "91744", "91745", "91746", "91748", "91755", "91755",
    "91765", "91770", "91770", "91789", "91792", "92807", "92808", "92821", "92823", "92860",
    "92870", "92880", "92882", "92886", "92887", "90815"
  ];

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
                <>
                  <div className='flex flex-row gap-2'>
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
      </div>
    
    </>
  );
}

export default App;
