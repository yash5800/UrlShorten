import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/lib';

const Hero = () => {
  //{ exists: true, shortcode: existingUrl.shortcode }

  const [exists, setExists] = useState(false);
  const [shortcode, setShortcode] = useState('');
  const { end } = useContext(AuthContext);

  const urlValidation = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const handleShorten = (e) => {
    e.preventDefault();
    const url = e.target.elements.url.value;

    if (!urlValidation(url)) {
      alert('Invalid URL');
      return;
    }

    // Call API to shorten URL
    console.log('URL to shorten:', url);
    fetch(`${end}/api/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Shortened URL:', data.shortcode ,exists);
        setExists(data.exists);
        setShortcode(data.shortcode);
      })
      .catch((error) => {
        console.error('Error shortening URL:', error);
      });
  }


  return (
    <div className='flex justify-between items-center min-h-screen text-white bg-slate-700 flex-col  px-4 py-4 gap-25'>

      <div className='flex flex-col py-5 justify-center items-center gap-6'>
       <p className='text-xl font-bold'>Paste Your Original URL Here:</p>
        <form action="" className='flex gap-3 max-md:flex-col' onSubmit={handleShorten}>
          <input type="text" name="url" placeholder="Enter URL" className="border py-2 px-9 min-xl:px-18 rounded-md" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Shorten</button>
        </form>
        {shortcode && <div className='flex flex-col px-5 bg-slate-800 rounded-md p-3 min-xl:px-18'>
          <p className='text-lg font-bold'>Shortened URL:</p>
          {!exists ? (
            <ul>
              <li className='text-blue-500'><a href={`${end}/${shortcode}`} target="_blank" rel="noopener noreferrer">{`${end}/${shortcode}`}</a></li>
            </ul>
          ) : (
            <ul>
              <p className='text-amber-200 py-2 font-light'>Already exists!</p>
              <li className='text-blue-500'><a href={`${end}/${shortcode}`} target="_blank" rel="noopener noreferrer">{`${end}/${shortcode}`}</a></li>
            </ul>
          )}
        </div>}
        <p className='text-lg text-gray-400 self-start px-5'>Shorten your URLs easily and efficiently.</p>
      </div>

      <div className='flex flex-col py-5 justify-center items-start gap-6 min-w-[300px] rounded-xl bg-slate-900 px-6 shadow-md shadow-gray-800'>
        <h2 className='text-lg font-bold'>Description:</h2>
        <p className='text-gray-300'>This is a URL shortening service that allows you to easily shorten your long URLs into more manageable links. Simply paste your original URL into the input box above, and click the "Shorten" button. The shortened URL will be generated for you!</p>
        <ul className='list-disc pl-5 text-gray-300'>
          <li>Shorten your URLs with ease.</li>
          <li>Share your shortened URLs with anyone.</li>
          <li>Access your shortened URLs anytime.</li>
        </ul>
      </div>
      
    </div>
  )
}

export default Hero