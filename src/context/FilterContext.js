import React, {useState, useContext, createContext} from 'react';

//create a context 
const FilterContext = createContext();

// create a provider component
export function FilterProvider({children}) {
  const [filters, setFilters] = useState({
    zip:false,
    projectType: false,
    buildingUse: false,
    zipCodes: [
      "91401", "91403", "91405", "91411", "91423", "91601", "91602", "91604", "91605", "91606", "91607",
      "91040", "91042", "91311", "91324", "91325", "91326", "91330", "91331", "91340", "91342", "91343", 
      "91344", "91345", "91352", "91402", "91301", "91302", "91303", "91304", "91306", "91307", "91367", 
      "91371", "91377", "93063", "93064", "91316", "91335", "91356", "91364", "91406", "91436", "91011", 
      "91020", "91046", "91201", "91202", "91203", "91207", "91208", "91214", "91501", "91502", "91504", 
      "91505", "91506"
    ], 
    //store these zips as string in the database and convert it into an array in the state
    projectTypes: ["Renovation","Site Work"],
    buildingUses: ["Residential Subdivision", "Retail", "Educational"]
  });

  const handleCheckBoxChange = (filterName) => {
    setFilters((prevFilter) => ({
      ...prevFilter,
      [filterName]: !prevFilter[filterName],
    }));
  }

  const updateZipConfig = (zipArray) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      zipCodes: [...zipArray]
    }));
  }

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
    <FilterContext.Provider value={{filters, handleCheckBoxChange, updateFilterConfig, updateZipConfig}}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  return useContext(FilterContext);
}
