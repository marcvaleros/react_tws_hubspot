import React, { useState, useEffect} from 'react';
import LoadingSpinner from '../components/loadingSpinner';
import ProjectUpload from '../components/Feature/ProjectUpload';
import CompanyUpload from '../components/Feature/CompanyUpload';
import Navbar from '../components/navbar';


function Home() {
  const [loading, setLoading] = useState(false);
  const [isProject, setProject] = useState(true);

  
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

  return (
    <div className='bg-hs-dark-gray min-h-screen'>
      { loading && (
        <div className="fixed inset-0 bg-hs-light-gray bg-opacity-90 flex justify-center items-center z-50">
          <div className="flex flex-col text-center">
            <img src="/Zach.png" alt='' height={150} width={150} className='animate-spin-slow hover:cursor-pointer self-center' />
            <LoadingSpinner className='justify-center items-center '/>
          </div>
        </div>
      )}
    <Navbar/>
    
    <div className="flex flex-row items-center justify-center space-x-2 mt-6">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            name='include'
            type="checkbox" 
            checked={isProject} 
            onChange={() => {
              setProject(prev => !prev)
            }} 
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500  transition-all"></div>
          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full"></div>
        </label>
        <span className="text-sm text-white">{isProject ? 'Project Based Upload' : 'Company Based Upload'}</span>
    </div>

    {
      isProject ? (
        <ProjectUpload setLoading={setLoading}/>
      ): (
        <CompanyUpload />
      )
    }
    
    
    </div>
  );
}

export default Home;
