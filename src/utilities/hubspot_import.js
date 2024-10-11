import axios from 'axios';
import FormData from 'form-data';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;


export async function uploadInvalidContacts(filename, invalidContactBlob){
  let form = new FormData();
  let fileName = `Invalid_Contacts_${filename}`;
  form.append('file', invalidContactBlob, fileName);

  try {
    const res = await axios.post(`${BASE_URL}upload-to-drive`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if(res.status === 200){
      return res.data.webViewLink;
    }else{
      console.log(`Failed to upload file to gdrive. Status ${res.status}`);
      return null;
    }
  } catch (error) {
    console.log(`Upload Invalid Contacts to Drive Failed. Error: ${error}`);
    return null;
  }
}

export async function sendToServer(fileName, contactBlob, companyBlob, contactBlob2, projectBlob, toggleModal, setLoading, hubspot_api_key, dealStage) {
  let form = new FormData();
  form.append('files', contactBlob, 'Construct Connect Contacts Main.csv');
  form.append('files', companyBlob, 'Construct Connect Company.csv');
  form.append('files', contactBlob2, 'Construct Connect Contacts.csv');
  form.append('files', projectBlob, 'Construct Connect Projects.csv');
  form.append('filename', fileName);
  form.append('hubspot_api_key', hubspot_api_key);
  form.append('deal_stage', dealStage);

  if(hubspot_api_key !== ''){
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}upload/contacts`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if(res.status === 200){
        console.log(res.data);
        console.log(res.message);
        toggleModal("Success");
      }else{
        toggleModal("Failed");
      }
      
    } catch (error) {
      console.log(`Error sending contact and company data to backend server. Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }else{
    console.log("There's no hubspot api key!");
  }
}


