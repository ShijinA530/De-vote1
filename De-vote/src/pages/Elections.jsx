import React, { useState, useEffect, useContext } from 'react';
import {ContractContext} from '../context/electionContext'
import creatElection from '../utils/CreateElection'
import castVote from '../utils/vote'

function Elections() {
  const [electionTypes, setElectionTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [candidates, setCandidates] = useState([]);
  const { contract, account  } = useContext(ContractContext);
  console.log(contract)
  console.log(account)
  
  useEffect(() => {
    async function fetchElectionTypes() {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/election`);
        if (!response.ok) {
          throw new Error('Failed to fetch election types');
        }
        const data = await response.json();
        setElectionTypes(data.electionTypes);
      } catch (error) {
        console.error('Error fetching election types:', error);
      }
    }
    fetchElectionTypes();
  }, []);

  const startElection = ()=>{
    const candidateNames = candidates.map(candidate => 
      `${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`
    );
    console.log(candidateNames)
    creatElection(account, contract, [selectedType], [candidateNames]);
    // console.log('voting')
    // castVote(account,contract)
    // console.log('voted')

  }
  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/election`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ electionType: selectedType }),
        
      });
      console.log(JSON.stringify({ electionType: selectedType }))
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      console.log(data)
      setCandidates(data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  
  const handleTypeSelect = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);
    console.log(selectedType)
    
  };
  useEffect(()=>{
    console.log("fetching")
   fetchCandidates();
  },[selectedType])

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-3xl font-bold mb-4">Election Post</h3>
      <div className="mb-4">
        <select
          value={selectedType}
          onChange={handleTypeSelect}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
        >
          <option value="" disabled>Select Election Type</option>
          {electionTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {/* <div>
        <h2 className="text-xl font-semibold mb-2">Candidates</h2>
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index} className="mb-2">{candidate.name}</li>
          ))}
        </ul>
      </div> */}
      <div className="mt-4">
  <h2 className="text-xl font-semibold mb-2">Candidates</h2>
  <ul>
    {candidates.map((candidate, index) => (
      <li key={index} className="border border-gray-300 p-4 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{candidate.firstName} {candidate.middleName} {candidate.lastName}</h3>
            <p className="text-gray-600">{candidate.department}</p>
            {/* Add more details as needed */}
          </div>
          {/* Add additional actions or buttons here if needed */}
        </div>
      </li>
    ))}
  </ul>
</div>
      
      <button
  onClick={startElection}
  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
  disabled={!selectedType || candidates.length === 0}
>
  Start Election
</button>
    </div>
  );
}

export default Elections;
