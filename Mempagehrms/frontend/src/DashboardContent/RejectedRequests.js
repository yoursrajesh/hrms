// RejectedRequests.js

import React, { useEffect, useState } from 'react';

const RejectedRequests = () => {
  const [rejectedLeaves, setRejectedLeaves] = useState([]);

  useEffect(() => {
    const fetchRejectedLeaves = async () => {
      try {
        const response = await fetch('http://localhost:5000/rejectedleaves');
        const data = await response.json();
        setRejectedLeaves(data.rejectedLeaves);
      } catch (error) {
        console.error('Error fetching rejected leaves:', error.message);
      }
    };

    fetchRejectedLeaves();
  }, []);

  return (
    <div>
      <h2>Rejected Leaves</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Supervisor</th>
            <th>Total Days</th>
          </tr>
        </thead>
        <tbody>
          {rejectedLeaves.map((rejectedLeave, index) => (
            <tr key={rejectedLeave._id}>
              <td>{index + 1}</td>
              <td>{rejectedLeave.leaveType}</td>
              <td>{new Date(rejectedLeave.startDate).toLocaleDateString()}</td>
              <td>{new Date(rejectedLeave.endDate).toLocaleDateString()}</td>
              <td>{rejectedLeave.supervisor}</td>
              <td>{rejectedLeave.totalDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RejectedRequests;
