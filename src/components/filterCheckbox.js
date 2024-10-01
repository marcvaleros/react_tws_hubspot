
import React, {useState} from 'react'
import { useFilter } from '../context/FilterContext';

export default function FilterCheckboxes() {
  //create a useContext here for the filter configs
  const {filters, handleCheckBoxChange, updateFilterConfig} = useFilter();
  const [inputBar, setInputBar] = useState(false);
  const [content, setContent] = useState('');

  const handleZipChange = (e) => {
    updateFilterConfig('zipCodes', e.target.value);
  }

  const handleNewInput = (e) => {
    setContent(e.target.value);
  }

  const handleEnterPress = (e) => {
    console.log("Triggered!");
    
    if (e.key === 'Enter') {
      updateFilterConfig('projectTypes', content);
      setContent('');
    }
  };
  return (
    <div className='flex flex-col space-y-2 self-start mx-4'>
      <div className='flex items-center'>
         <input id='filterZip' type="checkbox" checked={filters.zip} onChange={() => handleCheckBoxChange('zip')}
         className='h-4 w-4 text-orange-500 border-gray-300 rounded-full focus:ring-orange-500 transition-all ease-in-out cursor-pointer'
         />
         <label className="ml-2 text-sm text-gray-700">
             Excluded Zips
         </label>
      </div>

      {
        filters.zip && (
          <textarea  rows="10" cols="50" className='w-full rounded-md border-2 border-orange-500 focus:border-orange-500 focus:ring-orange-500 ' placeholder='Enter List of Zips Separated by Comma' value={filters.zipCodes} onChange={handleZipChange}></textarea>
        )
      }

      <div className='flex items-center'>
         <input id='filterProjectType' type="checkbox" checked={filters.projectType} onChange={() => handleCheckBoxChange('projectType')} 
         className='h-4 w-4 text-orange-500 border-gray-300 rounded-full focus:ring-orange-500 transition-all ease-in-out cursor-pointer'
         />
         <label className="ml-2 text-sm text-gray-700">
             Excluded Project Types 
         </label>
         {
            inputBar && (
              <div className='inline-flex'>
                <input onChange={handleNewInput} onKeyDown={handleEnterPress} value={content} className="rounded-full border-2 border-orange-500 ml-2 h-8" type='text' placeholder='Enter New Project Type'/>
              </div>
            )
          }
      </div>

      {
        filters.projectType && (
          <div className='inline-flex flex-wrap items-center h-8 px-4 gap-2'>
             {
              filters.projectTypes.map((type,index) => (
                <p key={index} className='bg-gray-600 hover:bg-gray-400 rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md transition-all ease-in-out'>{type}</p>
              ))
            }
            <button onClick={() => setInputBar(prev => !prev)} className='button bg-orange-500 hover:bg-orange-400 transition-all ease-in-out rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md'>Add</button>
          </div>
        )
      }
      
      <div className='flex items-center'>
         <input id='filterBuildingUse' type="checkbox" checked={filters.buildingUse} onChange={() => handleCheckBoxChange('buildingUse')}
         className='h-4 w-4 text-orange-500 hover:bg-orange-400 border-gray-300 rounded-full focus:ring-orange-500 transition-all ease-in-out cursor-pointer '
         />
         <label className="ml-2 text-sm text-gray-700">
             Excluded Building Use
         </label>
      </div>

      {
        filters.buildingUse && (
          <div className='inline-flex flex-wrap items-center h-8 px-4 gap-2'>
            {
              filters.buildingUses.map((uses,index) => (
                <p key={index} className='bg-gray-600 hover:bg-gray-400  rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md transition-all ease-in-out'>{uses}</p>
              ))
            }
            <button className='button bg-orange-500 hover:bg-orange-400 transition-all ease-in-out rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md'>Add</button>
          </div>
        )
      }

    </div>
  );
}

