import React, { useState, useEffect } from 'react';

const ApprovedLeavesPage = () => {
  const [approvedLeaves, setApprovedLeaves] = useState([]);

  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      try {
        const response = await fetch('http://localhost:5000/approvedleaves');
        const data = await response.json();
        setApprovedLeaves(data.approvedLeaves);
      } catch (error) {
        console.error('Error fetching approved leaves:', error.message);
      }
    };

    fetchApprovedLeaves();
  }, []);

  return (
    <div>
      <h2>Approved Leaves</h2>
      {approvedLeaves && approvedLeaves.length > 0 ? (
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
            {approvedLeaves.map((approvedLeave, index) => (
              <tr key={approvedLeave._id}>
                <td>{index + 1}</td>
                <td>{approvedLeave.leaveType}</td>
                <td>{new Date(approvedLeave.startDate).toLocaleDateString()}</td>
                <td>{new Date(approvedLeave.endDate).toLocaleDateString()}</td>
                <td>{approvedLeave.supervisor}</td>
                <td>{approvedLeave.totalDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No approved leaves yet.</p>
      )}
    </div>
  );
};

export default ApprovedLeavesPage;
