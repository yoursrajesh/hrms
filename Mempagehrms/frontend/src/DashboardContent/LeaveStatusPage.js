import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './LeaveStatusPage.css'; // Import a separate CSS file for styling
import TotalLeaves from './TotalLeaves'; // Import TotalLeaves component
import ApprovedRequests from './ApprovedRequests'; // Import ApprovedRequests component
import RejectedRequests from './RejectedRequests'; // Import RejectedRequests component

const LeaveStatusPage = () => {
  return (
    <div>
      <h3>Leave Status</h3>
      <nav className="leave-status-tabs">
        <Link to="total" className="leave-status-tab">Total Leaves</Link>
        <Link to="approved" className="leave-status-tab">Approved Requests</Link>
        <Link to="rejected" className="leave-status-tab">Rejected Requests</Link>
      </nav>
      <hr />
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
};

export default LeaveStatusPage;
