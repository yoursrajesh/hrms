import React, { useState, useEffect } from 'react';
import './ApplyLeaveForm.css';

const ApplyLeaveForm = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInMilliseconds = Math.abs(end - start);
      const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setTotalDays(diffInDays);
    }
  }, [startDate, endDate]);

  const handleSubmit = async () => {
    try {
      if (!supervisor) {
        console.error('Supervisor is required.');
        return;
      }

      const response = await fetch('http://localhost:5000/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          supervisor,
          totalDays,
        }),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        const responseData = await response.json();
        console.log('Leave application submitted successfully!', responseData);
        window.alert('Leave application submitted successfully!');
        // Optionally, you can perform additional actions here without reloading the page.
      } else {
        // If the request was not successful, log the error and handle it accordingly
        console.error('Leave application submission failed:', response.statusText);
        // You can also show an error message to the user.
      }

      // Rest of your code...
    } catch (error) {
      console.error('Error submitting leave application:', error.message);
      // Handle the error, and optionally show an error message to the user.
    }
  };

  return (
    <div className="apply-leave-card">
      <h2>Apply Leave</h2>
      <form>
        <div>
          <label>Leave Type:</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation</option>
            <option value="marriage">Marriage Leave</option>
            <option value="maternity">Maternity Leave</option>
            <option value="casual">Casual Leave</option>
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Supervisor:</label>
          <select value={supervisor} onChange={(e) => setSupervisor(e.target.value)}>
            <option value="Marry">Mary</option>
            <option value="Sreekanth">Sreekanth</option>
            <option value="Srinivas">Srinivas</option>
          </select>
        </div>
        <div>
          <label>Total Days:</label>
          <span>{totalDays}</span>
        </div>
        <div>
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeaveForm;
