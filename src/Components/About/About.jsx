import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const TEXT_ENDPOINT = `${BACKEND_URL}/text`;

function About() {
  const [aboutText, setAboutText] = useState('');
  const [error, setError] = useState('');

  const fetchAboutText = () => {
    axios
      .get(TEXT_ENDPOINT)
      .then((response) => {
        if (response.data.AboutKey) {
          setAboutText(response.data.AboutKey.text);
          setError('');
        } else {
          setError('About page content not found.');
        }
      })
      .catch((err) => setError(`Error fetching about page: ${err.message}`));
  };

  fetchAboutText();

  return (
    <div>
      <h1>About</h1>
      {error ? <p className='text-red-500'>{error}</p> : <p>{aboutText}</p>}
    </div>
  );
}

export default About;
