import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { useFranchisee } from '../context/FranchiseeContext';
import axios from 'axios';


function Dropdown(props) {
  const [query, setQuery] = useState('');
  const {franchisees} = useFranchisee();
  const [selected, setSelected] = useState(props.franchisee);

  useEffect(()=>{
    setSelected(props.franchisee);
  },[props.franchisee]);

  const filteredFranchisee = query === '' 
      ? franchisees
      : franchisees.filter((franchisee) =>
          franchisee.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelectChange = async (franchisee) => {
    setSelected(franchisee);
    const token = localStorage.getItem('authToken');
    try {
      //change the base url once deployed
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}api/auth/user/${props.user_id}/update/${franchisee.id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(JSON.stringify(response.data,null,2));
    } catch (error) {
      console.error('Error updating database:', error);
    }
  }
  return (
    
  <Combobox value={selected} onChange={handleSelectChange}>
    <div className="relative w-72">
      <div className="relative w-full">
        <ComboboxInput
          className="border border-gray-300 p-2 w-full rounded-md cursor-pointer"
          placeholder='Not Assigned'
          displayValue={(franchisee) => franchisee?.name}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </ComboboxButton>
      </div>

        <ComboboxOptions className="fixed mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm cursor-pointer z-50">
          {filteredFranchisee.length === 0 ? (
            <div className="px-4 py-2 text-gray-700">No results found.</div>
          ) : (
            filteredFranchisee.map((franchisee) => (
              <ComboboxOption
                key={franchisee.id}
                value={franchisee}
                className="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-indigo-600 hover:text-white text-gray-900"
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {franchisee.name}
                    </span>
                  </>
                )}
              </ComboboxOption>

            ))
          )}
        </ComboboxOptions>

    </div>
  </Combobox>

  );
}

export default Dropdown;
