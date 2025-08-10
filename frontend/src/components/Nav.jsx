import React from 'react'
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const handleAdminClick = () => {
    // Navigate to admin page
    navigate('/login');
  };
  return (
    <nav
     className='flex justify-between items-center p-4 bg-gray-800 text-white'
    >
      <p className='text-2xl font-bold'>Short<span className='text-green-500 font-sans'>fy</span></p>
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={handleAdminClick}>Admin</button>
    </nav>
  )
}

export default Nav