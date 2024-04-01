// // TotalLeavesPage.js

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import ApprovedRequests from './ApprovedRequests'; // Import the ApprovedRequests component
// import RejectedRequests from './RejectedRequests'; // Import the RejectedRequests component

// const TotalLeavesPage = () => {
//   const [leaveApplications, setLeaveApplications] = useState([]);
//   const [approvedApplications, setApprovedApplications] = useState([]);
//   const [rejectedApplications, setRejectedApplications] = useState([]);

//   useEffect(() => {
//     const fetchLeaves = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/totalleaves');
//         const data = await response.json();
//         setLeaveApplications(data.leaves);
//       } catch (error) {
//         console.error('Error fetching leave applications:', error.message);
//       }
//     };

//     fetchLeaves();
//   }, []);

//   const handleApproveReject = async (id, action) => {
//     try {
//       console.log(`${action} leave with id ${id}`);

//       // Fetch the leave from the database
//       const leave = leaveApplications.find(app => app._id === id);

//       if (!leave) {
//         console.error('Leave not found');
//         return;
//       }

//       // Update state based on the action
//       if (action === 'approve') {
//         const approvedApp = { ...leave };
//         setApprovedApplications(prevState => [...prevState, approvedApp]);
//       }

//       if (action === 'reject') {
//         // Make API request to update the server for rejection
//         const response = await fetch(`http://localhost:5000/rejectleave/${id}`, {
//           method: 'PUT',
//         });

//         if (response.ok) {
//           const rejectedApp = { ...leave };
//           setRejectedApplications(prevState => [...prevState, rejectedApp]);
//         } else {
//           console.error('Error rejecting leave:', response.statusText);
//         }
//       }

//       // Make API request to update the server for approval
//       const response = await fetch(`http://localhost:5000/approveleave/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ action }), // Send the action to the server
//       });

//       if (!response.ok) {
//         console.error('Error processing leave action:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error handling approve/reject:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Total Leaves</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>S.No</th>
//             <th>Leave Type</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             <th>Supervisor</th>
//             <th>Total Days</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaveApplications.map((leave, index) => (
//             <tr key={leave._id}>
//               <td>{index + 1}</td>
//               <td>{leave.leaveType}</td>
//               <td>{new Date(leave.startDate).toLocaleDateString()}</td>
//               <td>{new Date(leave.endDate).toLocaleDateString()}</td>
//               <td>{leave.supervisor}</td>
//               <td>{leave.totalDays}</td>
//               <td>
//                 <button onClick={() => handleApproveReject(leave._id, 'approve')}>Approve</button>
//                 <button onClick={() => handleApproveReject(leave._id, 'reject')}>Reject</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Display Approved Applications using ApprovedRequests component */}
//       <ApprovedRequests approvedApplications={approvedApplications} />

//       {/* Display Rejected Applications using RejectedRequests component */}
//       <RejectedRequests rejectedApplications={rejectedApplications} />

//       {/* Link to ApprovedRequests and RejectedRequests with respective state as a prop */}
//       <Link to={{ pathname: '/approvedrequests', state: { approvedApplications } }}>
//         View Approved Requests
//       </Link>
//       <br />
//       <Link to={{ pathname: '/rejectedrequests', state: { rejectedApplications } }}>
//         View Rejected Requests
//       </Link>
//     </div>
//   );
// };

// export default TotalLeavesPage;






// TotalLeavesPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApprovedRequests from './ApprovedRequests'; // Import the ApprovedRequests component
import RejectedRequests from './RejectedRequests'; // Import the RejectedRequests component
import './TotalLeavesPage.css'; // Import your CSS file

const TotalLeavesPage = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [showTotalLeaves, setShowTotalLeaves] = useState(true);
  const [showApprovedRequests, setShowApprovedRequests] = useState(false);
  const [showRejectedRequests, setShowRejectedRequests] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch('http://localhost:5000/totalleaves');
        const data = await response.json();
        setLeaveApplications(data.leaves);
      } catch (error) {
        console.error('Error fetching leave applications:', error.message);
      }
    };

    fetchLeaves();
  }, []);

  const handleApproveReject = async (id, action) => {
    try {
      console.log(`${action} leave with id ${id}`);

      // Fetch the leave from the database
      const leave = leaveApplications.find(app => app._id === id);

      if (!leave) {
        console.error('Leave not found');
        return;
      }

      // Update state based on the action
      if (action === 'approve') {
        const approvedApp = { ...leave };
        setApprovedApplications(prevState => [...prevState, approvedApp]);
      }

      if (action === 'reject') {
        // Make API request to update the server for rejection
        const response = await fetch(`http://localhost:5000/rejectleave/${id}`, {
          method: 'PUT',
        });

        if (response.ok) {
          const rejectedApp = { ...leave };
          setRejectedApplications(prevState => [...prevState, rejectedApp]);
        } else {
          console.error('Error rejecting leave:', response.statusText);
        }
      }

      // Make API request to update the server for approval
      const response = await fetch(`http://localhost:5000/approveleave/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }), // Send the action to the server
      });

      if (!response.ok) {
        console.error('Error processing leave action:', response.statusText);
      }
    } catch (error) {
      console.error('Error handling approve/reject:', error);
    }
  };

  const showTotalLeavesTable = () => {
    setShowTotalLeaves(true);
    setShowApprovedRequests(false);
    setShowRejectedRequests(false);
  };

  const showApprovedRequestsTable = () => {
    setShowTotalLeaves(false);
    setShowApprovedRequests(true);
    setShowRejectedRequests(false);
  };

  const showRejectedRequestsTable = () => {
    setShowTotalLeaves(false);
    setShowApprovedRequests(false);
    setShowRejectedRequests(true);
  };

  return (
    <div>
      <h2>Total Leaves</h2>

      <div className={showTotalLeaves ? 'visible' : 'hidden'}>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Supervisor</th>
              <th>Total Days</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveApplications.map((leave, index) => (
              <tr key={leave._id}>
                <td>{index + 1}</td>
                <td>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.supervisor}</td>
                <td>{leave.totalDays}</td>
                <td>
                  <button
                    onClick={() => handleApproveReject(leave._id, 'approve')}
                    className="approve-button" // Add dynamic class for styling
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveReject(leave._id, 'reject')}
                    className="reject-button" // Add dynamic class for styling
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>

     
    </div>
  );
};

export default TotalLeavesPage;
