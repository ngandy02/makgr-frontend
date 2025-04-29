import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

const MANU_READ_ENDPOINT = `${BACKEND_URL}/query`;

function ManuscriptText() {
  const { id } = useParams();
  const [manuscript, setManuscript] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${MANU_READ_ENDPOINT}/${id}`)
      .then((response) => setManuscript(response.data))
      .catch((err) =>
        setError(`There was a problem retrieving the manuscript. ${err}`),
      );
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!manuscript) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{manuscript.title}</h2>
        <p className="text-md text-gray-600 italic">by {manuscript.author}</p>
      </div>
      <div>
        <p className="text-gray-800">{manuscript.text}</p>
      </div>
    </div>
  );
}

export default ManuscriptText;
