import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ElectionCard from '../components/ElectionCard';
import MetamaskButton from '../components/MetamaskButton';

function Vote() {
  const navigate = useNavigate();
  const [candidatesData, setCandidatesData] = useState(null);
  
  useEffect(() => {
    // Fetch candidate data from backend when component mounts
    fetch(`${import.meta.env.VITE_SERVER_URI}/all-candidate`) // Assuming '/api/candidates' is the endpoint to fetch candidate data
      .then(response => response.json())
      .then(data => {
        setCandidatesData(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching candidate data:', error);
      });
  }, []);

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
              <ElectionCard key={electionKey} cardname={`${electionKey}`}  candidates={candidatesData[electionKey]} />
            
            ))}
          </div>
        ) : (
          <div className='max-w-[1000px] mx-[8%] py-5 px-8 bg-blue-200 rounded-lg flex flex-wrap justify-around'>
            <p>No election created.</p>
          </div>
        )}
      </div>
      <div className=' mr-10'>
      <MetamaskButton  />
      </div>
      

      
    </div>
  );
}

export default Vote;
