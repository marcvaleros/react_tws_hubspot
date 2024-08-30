import axios from 'axios';
import FormData from 'form-data';

const HUBSPOT_BASE_URL ="https://api.hubapi.com/crm/v3/imports/";


async function importToHubspot (fileName, contactBlob, companyBlob) {

  
  let importRequest = {
    "name": 'Construct Connect Outreach Leads V1',
    // "importOperations": {"0-1": "CREATE"},              
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
            "propertyName": "First Name"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Title",
            "propertyName": "Project"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Role",
            "propertyName": "Job Title"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Phone",
            "propertyName": "Phone Number"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Website",
            "propertyName": "Website URL"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Description",
            "propertyName": "Membership Notes"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Building Uses",
            "propertyName": "Building Uses"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Types",
            "propertyName": "Project Types"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Project Category",
            "propertyName": "Project Industry"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Address",
            "propertyName": "Street Address"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "City",
            "propertyName": "City"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "State",
            "propertyName": "State/Region"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "ZIP",
            "propertyName": "Postal Code"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Email",
            "propertyName": "Email",
            "columnType": "HUBSPOT_ALTERNATE_ID"
          },
          {
            "columnObjectTypeId": "0-1",
            "columnName": "Company ID",
            "propertyName": "Company Name"
          },
          {
            "columnName": "Company",
            "columnObjectTypeId": "0-1",
            "toColumnObjectTypeId": "0-2",
            "propertyName": null,
            "foreignKeyType": {
              "associationTypeId" : 279,
              "associationCategory": "HUBSPOT_DEFINED"
            }
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
            "propertyName": "Company",
            "associationIdentifierColumn": true,
          },
          {
            "columnObjectTypeId": "0-2",
            "columnName": "Company ID",
            "propertyName": "First Name"
          },
          {
            "columnObjectTypeId": "0-2",
            "columnName": "Company ID",
            "propertyName": "First Name"
          },
        ]
      }
    }
  ]


  }
  let data = new FormData();
  data.append('files', contactBlob, 'Construct Connect Contacts.csv');
  data.append('files', companyBlob, 'Construct Connect Company.csv');
  data.append('importRequest', JSON.stringify(importRequest));

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: HUBSPOT_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept':'application/json',
      'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
    },
    data: data
  };

  try {
    const res = await axios(config);
    console.log("Successfully Imported To HubSpot");
    return res.data
  } catch (error) {
    console.log("Error Importing to Hubspot",error);
  } 


}


export default importToHubspot 