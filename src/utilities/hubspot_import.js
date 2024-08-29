import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';

dotenv.config();

const HUBSPOT_BASE_URL ="https://api.hubapi.com/crm/v3/imports/";


async function importToHubspot (fileName, ) {
  
  let importRequest = {
    "name": 'Construct Connect Outreach',
    "importOperations": {"0-1": "CREATE"}, //create contacts
    "files": [
    {
      "fileName": "Construct Connect Contacts.csv",
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
          }
        ]
      }
    }
  ]


  }
  let data = new FormData();
  // data.append('files', '<string>');
  // data.append('importRequest', '<string>');

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: HUBSPOT_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept':'application/json',
      'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
      ...data.getHeaders()
    },
    data: data
  };

  try {
    const res = await axios.post(config);
    console.log(JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
    
  } 


}