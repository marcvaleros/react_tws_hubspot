import axios from 'axios';
import FormData from 'form-data';

const BASE_URL ="http://localhost:8080";

async function importToHubspot (fileName, contactBlob, companyBlob, toggleModal) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseFileName = fileName.replace('.csv', '');
  const formattedFileName = `${baseFileName}_${timestamp}`;  

  let importRequest = {
    "name": formattedFileName,
    "importOperations": {
      "0-1": "UPSERT",
      "0-2": "UPSERT"
    },
    "files": [
    {
      "fileName": `Construct Connect Contacts.csv`,
      "fileFormat": "CSV",
      "fileImportPage": {
        "hasHeader": true,
        "columnMappings": [
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Name",
            "propertyName": "firstname"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Title",
            "propertyName": "project"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Role",
            "propertyName": "jobtitle"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Company",
            "toColumnObjectTypeId": "0-2",
            "propertyName": null,
            "foreignKeyType": {
              "associationTypeId" : 279,
              "associationCategory": "HUBSPOT_DEFINED"
            }
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Phone",
            "propertyName": "phone"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Email",
            "propertyName": "email",
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Website",
            "propertyName": "website"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Description",
            "propertyName": "hs_content_membership_notes"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Building Uses",
            "propertyName": "building_uses"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Types",
            "propertyName": "project_types"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Category",
            "propertyName": "primary_industry"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Address",
            "propertyName": "address"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "City",
            "propertyName": "city"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "State",
            "propertyName": "state"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "ZIP",
            "propertyName": "zip"
          },
        ]
      }
    },
    {
      "fileName": `Construct Connect Company.csv`,
      "fileFormat": "CSV",
      "fileImportPage": {
        "hasHeader": true,
        "columnMappings": [
          {
            "columnObjectTypeId": "0-2",
            "columnName": "Company",
            "propertyName": "name",
            "associationIdentifierColumn": true,
          },
          {
            "columnObjectTypeId": "0-2",
            "columnName": "Website",
            "propertyName": "company_website"
          },
          {
            "columnObjectTypeId": "0-2",
            "columnName": "Domain",
            "propertyName": "domain"
          },
        ]
      }
    }
  ]

  }
  let form = new FormData();
  form.append('files', contactBlob, 'Construct Connect Contacts.csv');
  form.append('files', companyBlob, 'Construct Connect Company.csv');
  form.append('importRequest', JSON.stringify(importRequest));

  try {
    // const res = await axios.post(`${BASE_URL}/api/import`, form, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    
    // console.log("Server Data", res.data);
    // console.log("Successfully Connected to Server", res.status);
    
    toggleModal();

  } catch (error) {
    console.log("Error Importing to Hubspot", error.response ? error.response.data : error.message);
  } 

}

export default importToHubspot 