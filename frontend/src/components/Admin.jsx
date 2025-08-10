import React, { useEffect } from 'react'
import { AuthContext } from '../context/lib';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const Admin = () => {
  //'/api/urls'
  const { login , end } = React.useContext(AuthContext);
  const [urls, setUrls] = React.useState([]);
  const navigate = useNavigate();

  // Function to fetch URLs
  const fetchUrls = () => {
    fetch(`${end}/api/urls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${login}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUrls(data);
      })
      .catch((error) => {
        console.error('Error fetching URLs:', error);
      });
  };

  useEffect(() => {
    if (!login) {
      return navigate('/login');
    }
    fetchUrls();
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
          fetchUrls();
        } else {
          console.error('Error deleting URL:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error deleting URL:', error);
      });
  }

  // Handler for short URL click
  const handleShortUrlClick = () => {
    // Wait 500ms then refresh URLs to update view count
    setTimeout(() => {
      fetchUrls();
    }, 500);
  };


  return (
    <>
      <Nav />
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
                <td className='p-2'>
                  <a href={url.original_url} target="_blank" rel="noopener noreferrer">{url.original_url}</a>
                </td>
                <td className='p-2'>
                  <a 
                    href={`${end}/${url.shortcode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleShortUrlClick}
                  >{`${end}/${url.shortcode}`}</a>
                </td>
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
    </>
  )
}

export default Admin