// // Attendance.js
// import React from 'react';
// import { Link, Routes, Route } from 'react-router-dom';
// import AttendanceForm from './AttendanceForm';
// import ViewAttendance from './ViewAttendance';

// const Attendance = () => {
//   return (
//     <div>
//       <h2>Attendance Page</h2>
//       {/* Add tabs with Link components */}
//       <nav>
//         <ul>
//           <li>
//             <Link to="/dashboard/attendance/form">Attendance Form</Link>
//           </li>
//           <li>
//             <Link to="/dashboard/attendance/view">View Attendance</Link>
//           </li>
//         </ul>
//       </nav>

//       {/* Add routes for the tabs */}
//       <Routes>
//         <Route path="form" element={<AttendanceForm />} />
//         <Route path="view" element={<ViewAttendance />} />
//       </Routes>
//     </div>
//   );
// };

// export default Attendance;




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

