// ManageEmployeeContent.js
import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FaUserPlus, FaUsers, FaSearch } from 'react-icons/fa';
import './ManageEmployeeContent.css';  // Import the new CSS file for styling
import AddEmployeeForm from './AddEmployeeForm';
import UpdateEmployeeContent from './UpdateEmployeeContent';
import SearchEmployeeContent from './SearchEmployeeContent';

const ManageEmployeeContent = () => {
  const [activeTab, setActiveTab] = useState('addemployee');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="manage-employee-container">
      <div className="manage-employee-tabs-container">
        <button
          className={`manage-employee-tab ${activeTab === 'addemployee' ? 'active' : ''}`}
          onClick={() => handleTabClick('addemployee')}
        >
          <FaUserPlus className="manage-employee-tab-icon" /> Add Employee
        </button>
        <button
          className={`manage-employee-tab ${activeTab === 'updateemployee' ? 'active' : ''}`}
          onClick={() => handleTabClick('updateemployee')}
        >
          <FaUsers className="manage-employee-tab-icon" /> Employees
        </button>
        <button
          className={`manage-employee-tab ${activeTab === 'searchemployee' ? 'active' : ''}`}
          onClick={() => handleTabClick('searchemployee')}
        >
          <FaSearch className="manage-employee-tab-icon" /> Search
        </button>
      </div>

      {/* Use TransitionGroup and CSSTransition for animations */}
      <TransitionGroup className="manage-employee">
        <CSSTransition
          key={activeTab}
          timeout={300}
          classNames="fade"
        >
          <div className="manage-employee-content">
            {/* Conditionally render content based on the active tab */}
            {activeTab === 'addemployee' && <AddEmployeeForm />}
            {activeTab === 'updateemployee' && <UpdateEmployeeContent />}
            {activeTab === 'searchemployee' && <SearchEmployeeContent />}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ManageEmployeeContent;
