import casteVote from '../utils/vote.js'
import getPositionIndex from '../utils/candidateIndex.js'
import { ContractContext } from '../context/electionContext.jsx'
// import electionData from '../json/electionData.json'
import { useState, useEffect, useContext } from 'react'


function ElectionCard({ cardname, candidates }) {
  const [selectedCandidate, setSelectedCandidate] = useState();
  const { contract, account } = useContext(ContractContext)

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

  const handleVote = () => {
    console.log('inside handlevote')
    console.log(candidatesData)
    let candidatePosition = getPositionIndex(candidatesData, cardname);
    // console.log(candidatePosition);

    console.log('candidate position',candidatePosition);

    // console.log(account, contract, candidatePosition, selectedCandidate);
    casteVote(account, contract, candidatePosition, selectedCandidate);
    alert("Vote submitted!");
  };

  const handleCandidateSelection = (e) => {
    console.log('inside handleCandidateSelection ')
    console.log('Event:', e);
    console.log('Target value:', e.target.value);
    setSelectedCandidate(e.target.value);
    console.log('candidate setted')
  };

  return (
    <div className='bg-blue-600 w-1/3 p-4 flex flex-col justify-center items-center m-4 rounded-md hover:shadow-lg'>
      <h2 className='text-white font-medium text-xl'>{cardname}</h2>
      <form className='pt-2'>
        {candidates.map((candidate, index) => (
          <div key={index}>
          <ul>
            <li>
              <label className='text-lg font-medium'>
                <input
                  className='mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                  type="radio"
                  name="candidate"
                  value={index}
                  onChange={handleCandidateSelection}
                />
                {candidate}
              </label>
            </li>
          </ul>
        </div>
        ))}
        <button
          type="button"
          onClick={handleVote}
          className="mt-4 p-2 bg-green-500 text-white rounded"
        >
          Vote
        </button>
      </form>
    </div>
  );
}

export default ElectionCard;
