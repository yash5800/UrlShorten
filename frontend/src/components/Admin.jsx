import React, { useEffect } from 'react'
import { AuthContext } from '../context/lib';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  //'/api/urls'
  const { login , end } = React.useContext(AuthContext);
  const [urls, setUrls] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      return navigate('/login');
    }
    // Fetch URLs from the API
    fetch(`${end}/api/urls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${login}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched URLs:', data);
        setUrls(data);
      })
      .catch((error) => {
        console.error('Error fetching URLs:', error);
      });

    }, [login,end,navigate]);

  const handleDelete = (id) => {
    fetch(`${end}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${login}`
      },
    })
      .then((response) => {
        if (response.ok) {
          setUrls(urls.filter((url) => url.shortcode !== id));
        } else {
          console.error('Error deleting URL:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error deleting URL:', error);
      });
  }


  return (
    <div className='bg-slate-500 min-h-screen p-4'>

      <h1 className='text-2xl text-gray-100 font-bold mb-4'>These are your shortened URLs:</h1>
      <div className='overflow-x-auto py-5'>
        <table className='min-w-full bg-slate-800 rounded-lg overflow-hidden'>
          <thead>
            <tr className='text-white'>
              <th>Long URL</th>
              <th>Short URL</th>
              <th>Views</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='text-blue-400'>
            {urls.map((url) => (
              <tr key={url.shortcode} className='border-b border-gray-700'>
                <td className='p-2'>{url.original_url}</td>
                <td className='p-2'>{`${end}/${url.shortcode}`}</td>
                <td className='p-2'>{url.views}</td>
                <td className='p-2'>
                   <button 
                    className='bg-red-500 text-white px-4 py-2 rounded'
                    onClick={() => handleDelete(url.shortcode)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Admin