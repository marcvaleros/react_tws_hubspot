import { useState } from 'react';
import axios from 'axios';

const MagicLinkRequest = () => {
  const [formState, setFormState] = useState({
    email: '',
    message: '',
    status: 0,
    loading: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/auth/signup`, {
        email: formState.email,
      });
      setFormState({
        ...formState,
        message: response.data.message || 'Empty Response Body.',
        status: response.status,
        loading: false,
      });
    } catch (error) {
      setFormState({
        ...formState,
        message: error.response?.data?.message || 'Error sending magic link.',
        status: error.response?.status || 500,
        loading: false,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-4">
      <h1 className='text-2xl text-hs-orange'>Request a Magic Link ✨</h1>
      <form className='flex flex-row cursor-pointer rounded-full hover:shadow-lg w-2/4' onSubmit={handleSubmit}>
        <input 
          className='bg-hs-background rounded-l-full text-hs-dark-gray p-4 flex-grow cursor-pointer border-2 border-hs-orange'
          type="email" 
          placeholder="Enter your email"
          value={formState.email} 
          onChange={(e) => setFormState({ ...formState, email: e.target.value })} 
          required
        />
        <button className="bg-hs-orange rounded-r-full p-4" type="submit" disabled={formState.loading}>
          {formState.loading ? 'Sending...' : 'Send To Email'}
        </button>
      </form>
      {formState.message && (
        <p className={`p-4 rounded-md ${formState.status === 200 || formState.status === 201 ? 'bg-green-600' : 'bg-orange-600'}`}>
          {formState.message}
        </p>
      )}
    </div>
  );
};

export default MagicLinkRequest;
