// src/BottomBar.js
import React from 'react';
import './BottomBar.css'; // Import the external CSS file for styling

const BottomBar = () => {
  return (
    <div className="bottom-bar">
        <marquee behavior="scroll" direction="left">
          © 2024 Mempage Technologies Pvt Ltd . All rights reserved.
        </marquee>
      </div>
  );
};

export default BottomBar;
