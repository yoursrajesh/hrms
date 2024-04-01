// // LeaveManagementContent.js

// import React from 'react';
// import { Link } from 'react-router-dom';

// const LeaveManagementContent = () => {
//   return (
//     <div>
//       <h2>Leave Management</h2>
//       <div>
//         {/* Button to navigate to the Apply Leave form */}
//         <Link to="/dashboard/applyleave">
//           <button className="leave-management-button">Apply Leave</button>
//         </Link>

//         {/* Button to navigate to the Leave Status page */}
//         <Link to="/dashboard/leavestatus">
//           <button className="leave-management-button">Leave Status</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default LeaveManagementContent;







import React from 'react';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';


const LeaveManagementContent = () => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    navigate(`/dashboard/leavestatus/${tab}`);
  };

  return (
    <div>
      <h2>Leave Management</h2>
      <div>
        {/* Button to navigate to the Apply Leave form */}
        <Link to="/dashboard/applyleave">
          <button className="leave-management-button">Apply Leave</button>
        </Link>
        <Link to="/dashboard/leavestatus">
          <button className="leave-management-button">Leave status</button>
        </Link>

        
        
      </div>

      {/* Outlet for rendering nested routes */}
      <Outlet />

      {/* Define nested routes for TotalLeaves, ApprovedRequests, and RejectedRequests */}
      
    </div>
  );
};

export default LeaveManagementContent;








