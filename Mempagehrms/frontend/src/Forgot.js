import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signin', {
        loginmail: email,
        forgottenpassword:true
      });
      setMessage(response.data.message);
      console.log(response.data)
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const pathTokens = window.location.pathname.split('/');
    const tokenFromPath = pathTokens[2];
    setToken(tokenFromPath);
    // obj1.updateusercon({ "token": token });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/resetpassword/${token}`, {
        newpassword: password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>New Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Save New Password</button>
      {message && <p>{message}</p>}
    </form>
  );
};
export  { ForgotPassword,ResetPassword};