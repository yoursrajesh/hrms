


// src/Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaUser, FaPlus, FaSignOutAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa'; // Import icons from Font Awesome
import './Sidebar.css';

// Use the URL for your company logo
const companyLogoUrl = 'https://res.cloudinary.com/dd70o0ihc/image/upload/v1704774505/for_anni_nym9hl.png';

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing session, etc.)
    // For now, let's navigate to the login page
    navigate('/');
  //   closeSidebar(); // Close the sidebar after clicking Logout
  };

  const handleLinkClick = () => {
    closeSidebar(); // Close the sidebar when a link is clicked
  };


  return (
    <div className="sidebar">
      {/* Use an <img> tag with the company logo URL */}
      <div className="logo">
        <img src={companyLogoUrl} alt="Company Logo" style={{ width: '170px', height: '50px', borderRadius: '10px'}} />
      </div>
      
      {/* <div className="back-button" onClick={handleLinkClick}>
        <Link to="/dashboard" className="nav-link">
          <FaArrowLeft className="icon" />
        </Link>
      </div> */}

      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className="nav-link" onClick={handleLinkClick}>
            <FaHome className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/manageemployee" className="nav-link" onClick={handleLinkClick}>
            <FaUsers className="icon" /> Manage Employee
          </Link>
        </li>
        <li>
          <Link to="/dashboard/addprofile/add" className="nav-link" onClick={handleLinkClick}>
            <FaUser className="icon" /> Profiles
          </Link>
        </li>
        <li>
          <Link to="/dashboard/addcategory" className="nav-link" onClick={handleLinkClick}>
            <FaPlus className="icon" /> Add Category
          </Link>
        </li>
        <li>
          <Link to="/dashboard/leavemanagement" className="nav-link" onClick={handleLinkClick}>
            <FaCalendarAlt className="icon" /> Leave Management
          </Link>
        </li>
        <li>
          {/* Use onClick to handle the logout action */}
          <div className="nav-link" onClick={handleLogout}>
            <FaSignOutAlt className="icon" /> Logout
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
