import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './POLogin.css';
import NavBar from '../../components/NavBar/NavBar';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

function POLogin() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useAuthContext()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { email, password };

    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/po-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const data = await response.json(); // Extract the JSON payload from the response
            console.log('Login successful', data);

            // Assuming the 'login' function updates the application state and redirects
            login(data);
            navigate('/dashboard');
        } else {
            console.error('Failed to login. Status:', response.status);
            if (response.status === 400) {
                alert('Invalid email or password. Please try again.');
            } else {
                // Generic error for other statuses
                alert('An error occurred. Please try again later.');
            }
        }
    } catch (error) {
        console.error('Failed to connect to the server:', error);
        alert('Failed to connect to the server. Please check your connection and try again.');
    }
};


  return (
    <div className='registerpage'>
        <NavBar />
        <div className="register">
            <div className='login'>
                <div className="title"><h3 className='txt'>Presiding Officer</h3></div>
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <input
                            className='h-9 w-3/4 rounded-lg ml-10 mt-0'
                            type="email"
                            name='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
        
                        <input
                            className='h-9 w-3/4 rounded-lg ml-10 mt-[15px]'
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

export default POLogin;
