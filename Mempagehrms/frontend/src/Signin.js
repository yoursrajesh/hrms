import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signin.css'; // Import the custom styles
import { ForgotPassword } from './Forgot';

const Signin = () => {
  const [credentials, setCredentials] = useState({
    loginmail: '',
    loginpassword: '',
  });
  const[show, setShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const activateIP= () => {
    setShow(!show);
  }
  

  const login = async () => {
    try {
      // Clear previous error messages
      setErrorMessage('');

      const response = await axios.post("http://localhost:5000/signin", credentials);
      const responseMessage = response.data.message;

      if (responseMessage === 'User created and logged in successfully' || responseMessage === 'Log In successful') {
        setSuccessMessage('Login successful!'); // Set success message
        setTimeout(() => setSuccessMessage(''), 5000); // Clear success message after 5 seconds
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorMessage('Invalid credentials. Please check your email and password.'); // Set error message
    }
  };

  return (
    <>
      {/* Header */}
      <Navbar bg="dark" variant="dark" style={{ backgroundColor: 'black', width: '100%', height: '70px', display: 'flex', alignItems: 'center' }}>
        <Navbar.Brand href="#home" className='nav-heading' >Mempage</Navbar.Brand>
      </Navbar>

      {/* Signin Form */}
      <Container className="login-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="login-form text-center">
              <h2 className="login-heading">Login</h2>
              <Form>
                {/* Add placeholders to the email and password fields */}
                <Form.Group controlId="formEmail" className="field">
                  <Form.Control
                    type="email"
                    name="loginmail"
                    value={credentials.loginmail}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="login-input"
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="field">
                  <Form.Control
                    type="password"
                    name="loginpassword"
                    value={credentials.loginpassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="login-input"
                  />
                </Form.Group>

                <Button variant="primary" onClick={login} className="login-button" style={{ transition: 'background-color 0.3s' }}>
  Login
</Button>
<div className="forgot" style={{ marginTop: '10px', color: 'yellow', textDecoration: 'underline', cursor: 'pointer' }} onClick={activateIP}>
                  forgotten password
                </div>


                {/* Reserve space for error messages */}
                <div style={{ minHeight: '20px' }}>
                  {errorMessage && (
                    <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
                  )}

                  {successMessage && (
                    <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>
                  )}
                </div>
              </Form>
              {show && <ForgotPassword />}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Bottom Bar with Scrolling Text */}
      <div className="bottom-bar">
        <marquee behavior="scroll" direction="left">
          © 2024 Mempage Technologies Pvt Ltd. All rights reserved.
        </marquee>
      </div>
    </>
  );
};

export default Signin;
