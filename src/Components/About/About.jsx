import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const TEXT_ENDPOINT = `${BACKEND_URL}/text`;
const ABOUT_KEY = 'AboutKey';

function About() {
  const [aboutText, setAboutText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAboutText = () => {
      axios
        .get(TEXT_ENDPOINT)
        .then((response) => {
          if (response.data[ABOUT_KEY]) {
            setAboutText(response.data[ABOUT_KEY].text);
            setError('');
          } else {
            setError('About page content not found.');
          }
        })
        .catch((err) => setError(`Error fetching about page: ${err.message}`));
    };

    fetchAboutText();
  }, []);

  return (
    <div>
      {error ? <p className="text-red-500">{error}</p> : <p>{aboutText}</p>}
    </div>
  );
}

export default About;
