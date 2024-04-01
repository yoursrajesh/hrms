// ResumeViewer.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResumeViewer = ({ fileId }) => {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await axios.get('/file/${fileId}', { responseType: 'blob' });
      const resumeBlob = new Blob([response.data]);
      setResumeData(URL.createObjectURL(resumeBlob));
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  return (
    <div>
      {resumeData && (
        <iframe title="Resume" src={resumeData} style={{ width: '100%', height: '800px' }} />
      )}
    </div>
  );
};

export default ResumeViewer;