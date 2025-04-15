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
        setError(`There was a problem retrieving the manuscript. ${err}`)
      );
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!manuscript) return <div>Loading...</div>;


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{manuscript.title}</h1>
      <h1 className="text-xl font-semibold mb-4">{manuscript.author}</h1>
      <p className="text-gray-700 whitespace-pre-line">{manuscript.text}</p>
    </div>
  );
}

export default ManuscriptText;
