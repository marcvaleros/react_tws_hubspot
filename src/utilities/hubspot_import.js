import axios from 'axios';
import FormData from 'form-data';

// const BASE_URL ="https://react-tws-hubspot-be-a7eecd7171c3.herokuapp.com";
const BASE_URL ="http://localhost:8080";

export async function uploadInvalidContacts(filename, invalidContactBlob){
  let form = new FormData();
  let fileName = `Invalid_Contacts_${filename}`;
  form.append('file', invalidContactBlob, fileName);

  try {
    const res = await axios.post(`${BASE_URL}/upload-to-drive`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if(res.status === 200){
      console.log(`This is the link for the upload: ${JSON.stringify(res.data,null,1)}`);
    }else{
      console.log(`Failed to upload file to gdrive. Status ${res.status}`);
    }
  } catch (error) {
    console.log(`Upload Invalid Contacts to Drive Failed. Error: ${error}`);
  }
}

export async function sendToServer(fileName, contactBlob, companyBlob, contactBlob2, projectBlob, toggleModal, setLoading) {
  let form = new FormData();
  form.append('files', contactBlob, 'Construct Connect Contacts Main.csv');
  form.append('files', companyBlob, 'Construct Connect Company.csv');
  form.append('files', contactBlob2, 'Construct Connect Contacts.csv');
  form.append('files', projectBlob, 'Construct Connect Projects.csv');
  form.append('filename', fileName);

  try {
    setLoading(true);
    const res = await axios.post(`${BASE_URL}/upload/contacts`, form, {
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
}


