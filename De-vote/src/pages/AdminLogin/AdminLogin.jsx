import React, { useState } from 'react';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { useAuthContext } from '../../hooks/useAuthContext';


function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()
  const {login} = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Assuming adminId and password are correctly defined in your component's state
    const adminData = { email: adminId, password: password };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login as admin');
      }
  
      const data = await response.json(); // Extract the JSON payload from the response
      console.log(data)
      // Assuming you have a context or some state management to update
      // Replace `login` with however you're managing state; for example, through a context provider
      login(data); // Make sure `login` is ready to handle this object, including the token and userType
  
      navigate('/dashboard'); // Make sure `navigate` is defined, usually via `useNavigate` from react-router-dom
    } catch (error) {
      console.error('Error logging in as admin:', error.message);
      // Here, handle displaying the error to the user
    }
  };
  

  return (
    <div className='adminlogin'>
      <NavBar/>
      <div className='adm'>
        <div className='login'>
          <div className="title"><h3 className='txt'>Admin Login</h3></div>
          <div className="form">
              <form onSubmit={handleSubmit}>
                <input 
                  className='h-9 w-3/4 rounded-lg ml-10 mt-0' 
                  type="text" 
                  name='ID' 
                  placeholder='Email' 
                  value={adminId} 
                  onChange={(e) => setAdminId(e.target.value)}
                />
                <input 
                  className='h-9 w-3/4 rounded-lg ml-10 mt-4' 
                  type='password' 
                  name='password' 
                  placeholder='Password'
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className='pt-4 pr-11 flex justify-end'>
                  <input className='h-7 w-1/4 bg-purple-800 rounded-lg text-white cursor-pointer mr-[16px]' type='submit' value='Login'/>
                </div>
              </form>
          </div> 
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
