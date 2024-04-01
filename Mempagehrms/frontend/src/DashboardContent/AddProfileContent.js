// AddProfileContent.js
import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FaUserPlus, FaUsers, FaSearch } from 'react-icons/fa';
import './AddProfileContent.css';  // Update the CSS file for styling
import AddProfileForm from './AddProfileForm';
import UpdateProfileContent from './UpdateProfileContent';
import SearchProfileContent from './SearchProfileContent';

const ManageProfileContent = () => {
  const [activeTab, setActiveTab] = useState('addprofile');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="manage-profile-container">
      <div className="manage-profile-tabs-container">
        <button
          className={`manage-profile-tab ${activeTab === 'addprofile' ? 'active' : ''}`}
          onClick={() => handleTabClick('addprofile')}
        >
          <FaUserPlus className="manage-profile-tab-icon" /> Add Profile
        </button>
        <button
          className={`manage-profile-tab ${activeTab === 'updateprofile' ? 'active' : ''}`}
          onClick={() => handleTabClick('updateprofile')}
        >
          <FaUsers className="manage-profile-tab-icon" /> Profiles
        </button>
        <button
          className={`manage-profile-tab ${activeTab === 'searchprofile' ? 'active' : ''}`}
          onClick={() => handleTabClick('searchprofile')}
        >
          <FaSearch className="manage-profile-tab-icon" /> Search
        </button>
      </div>

      {/* Use TransitionGroup and CSSTransition for animations */}
      <TransitionGroup className="manage-profile-tab-content-container">
        <CSSTransition
          key={activeTab}
          timeout={300}
          classNames="fade"
        >
          <div className="manage-profile-tab-content">
            {/* Conditionally render content based on the active tab */}
            {activeTab === 'addprofile' && <AddProfileForm />}
            {activeTab === 'updateprofile' && <UpdateProfileContent />}
            {activeTab === 'searchprofile' && <SearchProfileContent />}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ManageProfileContent;
