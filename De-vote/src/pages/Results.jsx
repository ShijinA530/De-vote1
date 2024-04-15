import React, { useState, useEffect } from 'react';
import ResultCard from '../components/ResultCard'; // Import the ResultCard component

function Results() {
  const [postData, setPostData] = useState(null); // State to store fetched data
  const [showResults, setShowResults] = useState(false); // State to toggle results visibility

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/all-candidate`); // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        const data = await response.json();
        setPostData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  return (
    <div>
      <div className=' w-full flex justify-center'>
      <button
        className="  my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
        onClick={() => setShowResults(!showResults)} // Toggle showResults state
      >
        {showResults ? 'Hide Results' : 'Show Results'}
      </button>
      </div>
      
      {showResults && postData && (
        <div>
          {Object.entries(postData).map(([postName, candidates], index) => (
            <ResultCard
              key={index}
              postName={postName}
              postIndex={index} // Assuming index as postIndex
              candidates={candidates}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;
