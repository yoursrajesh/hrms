// // src/Header.js
// import React from 'react';
// import './Header.css'; // Import the external CSS file for styling

// const Header = () => {
//   return (
//     <div className="header">
//       <div className="title">Mempage</div>
//     </div>
//   );
// };

// export default Header;






// // src/Header.js
// import React, { useState } from 'react';
// import Switch from '@material-ui/core/Switch';
// import './Header.css'; // Import the external CSS file for styling
// import Sidebar from './Sidebar'; // Import the Sidebar component

// const Header = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(false);

//   const handleToggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//     // Implement your dark mode logic here
//   };

//   const handleToggleSidebar = () => {
//     setSidebarVisible((prevVisible) => !prevVisible);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-toggle" onClick={handleToggleSidebar}>
//         Toggle Sidebar
//       </div>
//       <div className="navbar-title">Mempage</div>
//       <div className="navbar-toggle">
//         <Switch
//           checked={darkMode}
//           onChange={handleToggleDarkMode}
//           color="default"
//         />
//       </div>
//       {sidebarVisible && <Sidebar />} {/* Render Sidebar if sidebarVisible is true */}
//     </nav>
//   );
// };

// export default Header;

import React, { useState } from 'react';
import './Header.css';
import Sidebar from './Sidebar';

const Header = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarVisible((prevVisible) => !prevVisible);
  };

  const handleSidebarOptionClick = () => {
    setSidebarVisible(false);
  };

  return (
    <div className={`app-container ${sidebarVisible ? 'sidebar-open' : ''}`}>
      <div className="navbar" style={{backgroundColor:'#999393'}}>
        <div className="navbar-toggle" onClick={handleToggleSidebar}>
          ☰
        </div>

        <div className="title">
          
          <img src="https://res.cloudinary.com/dd70o0ihc/image/upload/v1704774505/for_anni_nym9hl.png" style={{ width: '190px', height: '55px', borderRadius: '10px'}} />

        </div>

        {sidebarVisible && <Sidebar onOptionClick={handleSidebarOptionClick} />}
      </div>

      
    </div>
  );
};

export default Header;
