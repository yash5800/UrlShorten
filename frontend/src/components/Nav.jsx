import React from 'react'
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const handleAdminClick = () => {
    // Navigate to admin page
    navigate('/admin');
  };
  
  const handleHomeClick = () => {
    // Navigate to home page
    navigate('/');
  };
  return (
    <nav
     className='flex justify-between items-center p-4 bg-gray-800 text-white'
    >
      <p className='text-2xl font-bold'>Short<span className='text-green-500 font-sans'>fy</span></p>
      <div className='flex justify-center items-center gap-4'>
        <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleHomeClick}>Home</button>
        <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleAdminClick}>Admin</button>
      </div>
    </nav>
  )
}

export default Nav