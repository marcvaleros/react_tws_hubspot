import React, {useState, useContext, createContext} from 'react';

//create a context 
const FilterContext = createContext();

// create a provider component
export function FilterProvider({children}) {
  const [filters, setFilters] = useState({
    include: false,
    zip:false,
    projectType: false,
    buildingUse: false,
    //store these zips as string in the database and convert it into an array in the state
    zipCodes: [], 
    projectTypes: [],
    buildingUses: []
    // projectTypes: ["Renovation","Site Work"],
    // buildingUses: ["Residential Subdivision", "Retail", "Educational"]
  });

  //updating boolean value 
  const updateFilterValue = (filterName, value) => {
    setFilters((prevFilter) => ({
      ...prevFilter,
      [filterName]: value
    }))
  }

  //toggle checkboxes
  const handleCheckBoxChange = (filterName) => {
    setFilters((prevFilter) => ({
      ...prevFilter,
      [filterName]: !prevFilter[filterName],
    }));
  }

  //for the zips
  const updateZipConfig = (zipArray) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      zipCodes: [...zipArray]
    }));
  }

  //for updating arrays
  const updateFilterConfig = (filterName, value) => {
    setFilters((prevFilter) => {
      const currentArray = prevFilter[filterName] || [];
  
      if (currentArray.includes(value)) {
        return {
          ...prevFilter,
          [filterName]: currentArray.filter(item => item !== value),
        };
      } else {
        // If it doesn't exist, add it
        return {
          ...prevFilter,
          [filterName]: [...currentArray, value],
        };
      }
    });
  };

  return (
    <FilterContext.Provider value={{filters, handleCheckBoxChange, updateFilterConfig, updateZipConfig, updateFilterValue}}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  return useContext(FilterContext);
}
