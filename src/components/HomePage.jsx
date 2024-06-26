import React from 'react'
import school from '../assets/school.png';
import HomePageAnimationBar from './HomePageAnimationBar';

function HomePage() {
  return (
    <>
    <div className='flex h-screen gap-20 flex-col items-center justify-center'>
      <img src={school} alt="" className="object-cover max-w-50 max-h-60" />
      <span className='text-xl text-center font-body font-medium'>Streamlining assignment management for teachers and students alike!</span>
    </div>
    </>
  )
}

export default HomePage
