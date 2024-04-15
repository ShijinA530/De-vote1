import React from 'react'

function DashCard({cardname,data,}) {
  return (
    <div className=' bg-blue-600 w-1/3 p-5 h-60 flex flex-col justify-center items-center m-4 rounded-md hover:shadow-lg'>
      <h1 className=' text-white text-xl'>{cardname}</h1>
      
      <h1 className=' text-white text-xl'>{data}</h1>
    </div>
  )
}

export default DashCard
