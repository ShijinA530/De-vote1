import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ElectionCard from '../components/ElectionCard';
import MetamaskButton from '../components/MetamaskButton';

function Vote() {
  const navigate = useNavigate();
  const [candidatesData, setCandidatesData] = useState(null);
  const [userDepartment, setUserDepartment] = useState('');
  const [data, setData] = useState({ registeredVoters: 0, electionTypes: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch voters to get user's department
    const fetchVoters = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/voter`);
        if (!response.ok) throw new Error('Failed to fetch voters');
        const voters = await response.json();
        const user = voters.find(v => v._id === localStorage.getItem('userId'));
        if (user) {
          setUserDepartment(user.department);
        } else {
          console.error('User not found in voter list');
        }
      } catch (error) {
        console.error('Error fetching voters:', error);
      }
    };

    // Fetch candidate data
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/all-candidate`);
        if (!response.ok) throw new Error('Failed to fetch candidates');
        const candidates = await response.json();
        setCandidatesData(candidates);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      }
    };

    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const result = await response.json();
        setData({
          registeredVoters: result.totalUsers,
          electionTypes: result.numElectionTypes
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVoters();
    fetchCandidates();
    fetchData();
  }, []);

  useEffect(() => {
    if (candidatesData) {
      console.log('Updated candidatesData:', candidatesData);
      console.log(candidatesData['Department Rep'])
    }
  }, [candidatesData]);

  const handleButton = () => {
    navigate('/results');
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className='relative max-w-[1000px] mx-[8%] mt-[3%] mb-[2%] py-5 px-8 bg-blue-200 rounded-lg flex flex-wrap justify-around'>
          <h2 className='text-2xl text-black font-medium'>Active Elections</h2>
          <h2 className='text-2xl font-medium text-black'>{data.electionTypes}</h2> 
        </div>
        {candidatesData && Object.keys(candidatesData).length > 0 ? (
          <div className='max-w-[1000px] mx-[8%] py-5 px-8 bg-blue-200 rounded-lg flex flex-wrap justify-around'>
            {Object.keys(candidatesData).map((electionKey) => (
              <ElectionCard key={electionKey} cardname={electionKey} candidates={candidatesData[electionKey]} userDepartment={userDepartment} />
            ))}
          </div>
        ) : (
          <div className='max-w-[1000px] mx-[8%] py-5 px-8 bg-blue-200 rounded-lg flex flex-wrap justify-around'>
            <p>No election created.</p>
          </div>
        )}
      </div>
      <div className='mr-10'>
        <MetamaskButton />
      </div>
    </div>
  );
}

export default Vote;
