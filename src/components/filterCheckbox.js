import { forwardRef, useImperativeHandle, useState } from 'react';
import { useFilter } from '../context/FilterContext';

const FilterCheckboxes = forwardRef((props, ref) => {
  const { filters, handleCheckBoxChange, updateFilterConfig, updateZipConfig } = useFilter();
  const [inputBar, setInputBar] = useState([false, false]);
  const [formData, setFormData] = useState({
    content: '',
    buildingContent: '',
    zipContent: filters.zipCodes.join(','),
  });

  // Save configuration function
  const saveConfiguration = () => {
    const zipArray = formData.zipContent.split(',').map(zip => zip.trim()).filter(zip => zip);
    updateZipConfig(zipArray);
    setFormData({ ...formData, zipContent: '' });
  };

  useImperativeHandle(ref, () => ({
    saveConfiguration,
  }));

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Enter press to update the respective config
  const handleEnterPress = (e, name) => {
    if (e.key === 'Enter') {
      if (name === 'project_type') {
        updateFilterConfig('projectTypes', formData.content);
        setFormData({ ...formData, content: '' });
      } else if (name === 'building_use') {
        updateFilterConfig('buildingUses', formData.buildingContent);
        setFormData({ ...formData, buildingContent: '' });
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2 self-start mx-4">
      {/* ZIP Filter */}
      <div className="flex items-center">
        <input
          id="filterZip"
          type="checkbox"
          checked={filters.zip}
          onChange={() => handleCheckBoxChange('zip')}
          className="h-4 w-4 text-orange-500 border-gray-300 rounded-md focus:ring-orange-500 transition-all ease-in-out cursor-pointer"
        />
        <label className="ml-2 text-sm text-gray-700">Excluded Zips</label>
      </div>

      {filters.zip && (
        <textarea
          rows="10"
          cols="50"
          name="zipContent"
          className="w-full rounded-md border-2 border-orange-500 focus:border-orange-500 focus:ring-orange-500"
          placeholder="Enter List of Zips Separated by Comma"
          value={formData.zipContent}
          onChange={handleInputChange}
        />
      )}

      {/* Project Type Filter */}
      <div className="flex items-center mb-4">
        <input
          id="filterProjectType"
          type="checkbox"
          checked={filters.projectType}
          onChange={() => handleCheckBoxChange('projectType')}
          className="h-4 w-4 text-orange-500 border-gray-300 rounded-md focus:ring-orange-500 transition-all ease-in-out cursor-pointer"
        />
        <label className="ml-2 text-sm text-gray-700">Excluded Project Types</label>
        {inputBar[0] && (
          <input
            name="content"
            onChange={handleInputChange}
            onKeyDown={(e) => handleEnterPress(e, 'project_type')}
            value={formData.content}
            className="rounded-full border-2 border-orange-500 ml-2 h-8 text-sm"
            type="text"
            placeholder="Add Project Type"
          />
        )}
      </div>

      {filters.projectType && (
        <div className="inline-flex flex-wrap items-center px-4 gap-2">
          {filters.projectTypes.map((type, index) => (
            <p
              key={index}
              className="my-0 bg-gray-600 hover:bg-gray-400 rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md transition-all ease-in-out"
            >
              {type}
            </p>
          ))}
          <button
            onClick={() => setInputBar((prev) => [!prev[0], prev[1]])}
            className="button bg-orange-500 hover:bg-orange-400 transition-all ease-in-out rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md"
          >
            Add
          </button>
        </div>
      )}

      {/* Building Use Filter */}
      <div className="flex items-center mb-4">
        <input
          id="filterBuildingUse"
          type="checkbox"
          checked={filters.buildingUse}
          onChange={() => handleCheckBoxChange('buildingUse')}
          className="h-4 w-4 text-orange-500 hover:bg-orange-400 border-gray-300 rounded-md focus:ring-orange-500 transition-all ease-in-out cursor-pointer"
        />
        <label className="ml-2 text-sm text-gray-700">Excluded Building Use</label>
        {inputBar[1] && (
          <input
            name="buildingContent"
            onChange={handleInputChange}
            onKeyDown={(e) => handleEnterPress(e, 'building_use')}
            value={formData.buildingContent}
            className="rounded-full border-2 border-orange-500 ml-2 h-8 text-sm"
            type="text"
            placeholder="Add Building Use"
          />
        )}
      </div>

      {filters.buildingUse && (
        <div className="inline-flex flex-wrap items-center px-4 gap-2">
          {filters.buildingUses.map((uses, index) => (
            <p
              key={index}
              className="bg-gray-600 hover:bg-gray-400 rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md transition-all ease-in-out"
            >
              {uses}
            </p>
          ))}
          <button
            onClick={() => setInputBar((prev) => [prev[0], !prev[1]])}
            className="button bg-orange-500 hover:bg-orange-400 transition-all ease-in-out rounded-full px-4 text-[14px] text-white cursor-pointer shadow-md"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
});

export default FilterCheckboxes;
