import React, { useEffect, useState } from 'react';
import MetamaskButton from '../components/MetamaskButton';
import DashCard from '../components/DashCard';

function Dashboard() {
  const [data, setData] = useState({ totalElections: 0, registeredVoters: 0, electionTypes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/dashboard`); // Adjust this URL to your API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData({
          totalElections: 2, // This should be dynamic from API
          registeredVoters: result.totalUsers,
          electionTypes: result.numElectionTypes
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className='flex flex-row-reverse mr-[8%]'><MetamaskButton/></div>
      <div className='max-w-[700px] mx-auto my-[8%] py-5 px-8 bg-blue-200 rounded-lg flex flex-wrap justify-around'>
        <DashCard cardname={'Active Elections'} data={data.totalElections}/>
        <DashCard cardname={'Registered Voters'} data={data.registeredVoters}/>
      </div>
    </>
  );
}

export default Dashboard;
