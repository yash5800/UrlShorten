import React from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/lib';

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');

  const {setLogin ,end} = React.useContext(AuthContext);

  //{ message: 'Login successful' }
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    const formData = new FormData(e.target);
    const adminName = formData.get('adminName');
    const password = formData.get('password');
    console.log('Admin Name:', adminName);
    console.log('Password:', password);

    fetch(`${end}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username:adminName, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Login response:', data);
        if(data.message === 'Login successful') {
          // Handle successful login
          console.log('Login successful');
          setMessage('Login successful');
          setLogin(adminName); // Set the login state
          navigate('/admin'); // Redirect to admin page
        } else {
          // Handle login failure
          console.log('Login failed');
          setMessage('Login failed');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };
  return (
    <div className='flex justify-center items-center h-screen bg-gray-700 w-full'>
      <div className='flex justify-center items-center flex-col bg-white p-10 rounded shadow-md'>
        <h2 className='text-2xl font-bold mb-4'>Admin Login</h2>
        {message == "Login failed" ? <p className='text-red-500'>{message}</p> : <p className='text-green-500'>{message}</p>}
        <form className='flex flex-col' onSubmit={handleLogin}>
          <label className='mb-2 flex flex-col'>
            Admin Name:
            <input type='text' name='adminName' className='border p-2 rounded-md' />
          </label>
          <label className='mb-2 flex flex-col'>
            Password:
            <input type='password' name='password' className='border p-2 rounded-md' />
          </label>
          <button className='bg-blue-500 text-white px-4 py-2 rounded'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login