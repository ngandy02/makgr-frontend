import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";

import { BACKEND_URL } from "../../constants";

const MANU_READ_ENDPOINT = `${BACKEND_URL}/query`;

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Manuscript({ manuscript, fetchManuscripts, setError, setSuccess }) {
  const { _id, title, author, author_email, referees, state } = manuscript;

  const deleteManuscript = () => {
    const res = confirm("Delete this submission?");
    if (res) {
      axios
        .delete(`${MANU_READ_ENDPOINT}/${_id}`)
        .then(() => {
          fetchManuscripts();
          setSuccess(`${title} deleted successfully!`);
        })
        .catch((error) =>
          setError(`There was a problem deleting the manuscript. ${error}`),
        );
    }
  };

  return (
    <div>
      <div className="my-4 flex justify-between rounded border-2 border-accent p-8">
        <h2 className="text-xl">
          <Link to={title} className="font-bold hover:text-orange-500">
            {title}
          </Link>
        </h2>
        <p className="text-xl"> Author: {author} </p>
        <p className="text-xl"> Email: {author_email} </p>
        <p className="text-xl"> Refs: {referees.join(", ")} </p>
        <p className="text-xl"> State: {state} </p>
        <div className="flex space-x-2">
          {/* <button
            onClick={showUpdatingForm}
            className="border-none bg-transparent cursor-pointer hover:bg-gray-200 focus:bg-gray-200"
          >
            <img src={edit} alt="Update" className="min-w-5 w-5" />
          </button> */}
          <button
            onClick={deleteManuscript}
            className="p-2 border-none rounded-full hover:bg-red-100 focus:bg-red-100 transition"
          >
            <FaRegTrashAlt className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
      {/* <UpdatePersonForm
        email={email}
        visible={updatingPerson}
        cancel={hideUpdatingForm}
        fetchPeople={fetchPeople}
        setError={setError}
        setSuccess={setSuccess}
      /> */}
    </div>
  );
}
Manuscript.propTypes = {
  manuscript: propTypes.shape({
    _id: propTypes.string.isRequired,
    title: propTypes.string.isRequired,
    author: propTypes.string.isRequired,
    author_email: propTypes.string.isRequired,
    referees: propTypes.array.isRequired,
    state: propTypes.string.isRequired,
  }).isRequired,
  fetchManuscripts: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
};

function manuscriptObjectToArray(Data) {
  const keys = Object.keys(Data);
  const manuscripts = keys.map((key) => Data[key]);
  return manuscripts;
}

function Dashboard() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      <h2 className="text-lg font-bold">To Do</h2>
      <h2 className="text-lg font-bold">My Submissions</h2>
      <div className="text-green-700">{success}</div>
      {error && <ErrorMessage message={error} />}
      {manuscripts.map((manuscript) => (
        <Manuscript
          key={manuscript.id}
          manuscript={manuscript}
          fetchManuscripts={fetchManuscripts}
          setError={setError}
          setSuccess={setSuccess}
        />
      ))}
    </div>
  );
}

export default Dashboard;
