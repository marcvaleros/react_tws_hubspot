import axios from 'axios';
import FormData from 'form-data';

// const BASE_URL ="https://react-tws-hubspot-be-a7eecd7171c3.herokuapp.com";
const BASE_URL ="http://localhost:8080";


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


