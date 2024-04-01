import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Signin from './Signin';
import { ResetPassword } from './Forgot';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/resetpassword/:token" element={ < ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;