// EmployeeSearchForm.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './EmployeeSearchForm.css';

const EmployeeSearchForm = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="search-form">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search by Name, EmpId, or Mobile"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default EmployeeSearchForm;
