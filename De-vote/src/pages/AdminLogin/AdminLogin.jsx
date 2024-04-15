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
        if (response.status === 400) {
          // Handle 401 Unauthorized response
          alert('Incorrect email or password. Please try again.');
        } else {
          // Handle other kinds of errors
          alert('Login failed. Please try again later.');
        }
        throw new Error('Failed to login as admin');
      }
  
      const data = await response.json();
      console.log(data);
      login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in as admin:', error.message);
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
