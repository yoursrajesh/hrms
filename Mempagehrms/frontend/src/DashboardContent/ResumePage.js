// src/DashboardContent/ResumePage.js
import React from 'react';

const ResumePage = ({ resumeURL }) => {
  return (
    <div>
      <h3>User Resume</h3>
      <iframe title="resume" src={resumeURL} width="100%" height="600px"></iframe>
    </div>
  );
};

export default ResumePage;
