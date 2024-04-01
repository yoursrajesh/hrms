
// Dashboard.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';
import DashboardContent from './DashboardContent/DashboardContent';
import ManageEmployeeContent from './DashboardContent/ManageEmployeeContent';
import AddProfileContent from './DashboardContent/AddProfileContent';
import AddCategoryContent from './DashboardContent/AddCategoryContent';
import UpdateProfileContent from './DashboardContent/UpdateProfileContent';
import SearchProfileContent from './DashboardContent/SearchProfileContent';
import LeaveManagementContent from './DashboardContent/LeaveManagementContent';
import ApplyLeaveForm from './DashboardContent/ApplyLeaveForm';
import LeaveStatusPage from './DashboardContent/LeaveStatusPage';
import TotalLeaves from './DashboardContent/TotalLeaves';
import ApprovedRequests from './DashboardContent/ApprovedRequests';
import RejectedRequests from './DashboardContent/RejectedRequests';
import AddEmployeeForm from './DashboardContent/AddEmployeeForm';
import UpdateEmployeeContent from './DashboardContent/UpdateEmployeeContent';
import SearchEmployeeContent from './DashboardContent/SearchEmployeeContent';


import './Dashboard.css';

const Dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <div className="dashboard-container">
      {sidebarVisible && <Sidebar closeSidebar={closeSidebar} />} {/* Pass closeSidebar to Sidebar */}
      <div className="dashboard-content">
        <Header toggleSidebar={() => setSidebarVisible(!sidebarVisible)} closeSidebar={closeSidebar} /> {/* Pass closeSidebar to Header */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="profiles/*" element={<AddProfileContent />} />
            <Route path="addprofile/*" element={<AddProfileContent />}>
              
              <Route path="update" element={<UpdateProfileContent />} />
              <Route path="search" element={<SearchProfileContent />} />
            </Route>
            <Route path="addcategory" element={<AddCategoryContent />} />
            <Route path="leavemanagement" element={<LeaveManagementContent />} />
            <Route path="applyleave" element={<ApplyLeaveForm />} />

            {/* Manage Employee Routes */}
            <Route path="manageemployee/*" element={<ManageEmployeeContent />}>
              <Route path="add" element={<AddEmployeeForm />} />
              <Route path="update" element={<UpdateEmployeeContent />} />
              <Route path="search" element={<SearchEmployeeContent />} />
            </Route>
            

            {/* New Routes for Leave Status */}
            <Route path="leavestatus" element={<LeaveStatusPage />}>
              <Route path="total" element={<TotalLeaves />} />
              <Route path="approved" element={<ApprovedRequests />} />
              <Route path="rejected" element={<RejectedRequests />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default Dashboard;

