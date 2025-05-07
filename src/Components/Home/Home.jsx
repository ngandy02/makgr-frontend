import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

const MANU_READ_ENDPOINT = `${BACKEND_URL}/query`;

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Manuscript({ manuscript}) {
  const {title, author, abstract, text} = manuscript;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-md text-gray-600 italic">by {author}</p>
      </div>
      <div>
        <h2 className="text-2l font-bold text-gray-900">Abstract</h2>
        <p className="text-gray-800">{abstract}</p>
        <h2 className="text-2l font-bold text-gray-900">Text</h2>
        <p className="text-gray-800">{text}</p>
      </div>
    </div>
  );
  
}
Manuscript.propTypes = {
  manuscript: propTypes.shape({
    title: propTypes.string.isRequired,
    author: propTypes.string.isRequired,
    abstract: propTypes.string.isRequired,
    text: propTypes.string.isRequired,
  }).isRequired,
};

function manuscriptObjectToArray(Data) {
  const keys = Object.keys(Data);
  const manuscripts = keys.map((key) => Data[key]);
  return manuscripts;
}

function Home() {
  const [error, setError] = useState("");
  const [manuscripts, setManuscripts] = useState([]);

  const fetchManuscripts = () => {
    axios
      .get(MANU_READ_ENDPOINT)
      .then(({ data }) => {
        setManuscripts(manuscriptObjectToArray(data));
      })
      .catch((error) =>
        setError(
          `There was a problem retrieving the list of manuscripts. ${error}`,
        ),
      );
  };

  useEffect(fetchManuscripts, []);

  return (
    <div className="wrapper">
      {error && <ErrorMessage message={error} />}
      {manuscripts.map(
        (manuscript) =>
          manuscript.state == "PUB" && (
            <Manuscript
              key={manuscript.id}
              manuscript={manuscript}
            />
          ),
      )}
    </div>
  );
}


export default Home;
