import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";

import { BACKEND_URL } from "../../constants";

const MANU_READ_ENDPOINT = `${BACKEND_URL}/query`;
const FSM_ENDPOINT = `${BACKEND_URL}/query/handle_action`;
const STATES_ENDPOINT = `${BACKEND_URL}/query/states`;
const ACTIONS_ENDPOINT = `${BACKEND_URL}/query/actions`;

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function fetchStates(setError) {
  const [stateOptions, setStateOptions] = useState({});

  useEffect(() => {
    axios
      .get(STATES_ENDPOINT)
      .then((response) => {
        setStateOptions(response.data);
      })
      .catch((error) => {
        setError(`Error fetching states: ${error.response.data.message}`);
      });
  }, [setError]);

  return stateOptions;
}

function fetchActions(setError){
  const [actionOptions, setActionOptions] = useState({});

  useEffect(() => {
    axios
      .get(ACTIONS_ENDPOINT)
      .then((response) => {
        setActionOptions(response.data);
      })
      .catch((error) => {
        setError(`Error fetching actions: ${error.response.data.message}`);
      });
  }, [setError]);

  return actionOptions;
}

function Manuscript({ manuscript, fetchManuscripts, setError, setSuccess }) {
  const { _id, title, author, author_email, referees, state } = manuscript;
  const stateOptions = fetchStates(setError);
  const stateName = stateOptions[state];
  const actionOptions = fetchActions(setError);
  const [selectedAction, setSelectedAction] = useState("");
  const [validActions, setValidActions] = useState([]);

  const [manu, setManu] = useState([]);


  const handleAction = () => {
    const thisManu = {
      _id: _id,
      referees: referees,
      curr_state: state,
      action: selectedAction,
    };

    axios
      .put(FSM_ENDPOINT, thisManu)
      .then((response) => {
        const newState = response.data.return;
        setManu((prevManuscripts) =>
          prevManuscripts.map((m) =>
            m._id === manu._id ? { ...m, state: newState } : m,
          ),
        );
        fetchManuscripts();
        setSuccess(`${title} performed "${actionOptions[selectedAction]}" successfully!`);
        setSelectedAction("");
      })
      .catch((error) =>
        setError(`There was a problem performing action on the manuscript. ${error}`),
      );
      
  };


  const fetchValidActions = () => {
    axios
      .get(`${ACTIONS_ENDPOINT}/${state}`)
      .then((response) => {
        setValidActions(response.data);
        console.log("Fetched valid actions:", response.data);
      })
      .catch((error) => {
        setError(`Error fetching valid actions: ${error.response.data.message}`);
      });
  }

  useEffect(fetchManuscripts, []);
  useEffect(fetchValidActions, [state])

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 mb-4 border border-gray-200 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            <Link
              to={title}
              className="hover:text-orange-500 transition duration-200"
            >
              {title}
            </Link>
          </h2>
          <p className="text-gray-700">
            <span className="font-bold">Author:</span> {author}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Email:</span> {author_email}
          </p>
          <p className="text-gray-700 font-bold">Referees:</p>
          <ul className="list-disc pl-6 text-gray-700">
            {referees.map((referee, index) => (
              <li key={index}>{referee}</li>
            ))}
          </ul>
          <p className="text-gray-700">
            <span className="font-bold">State:</span> {stateName}
          </p>
        </div>

        <div className="absolute top-4 right-4">
          <label className="block font-semibold">
            Choose Action:
          </label>
          <select
              className="mt-1 p-2 border border-gray-300 rounded"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="" disabled>
              -- Select an Action --
            </option>
            {validActions?.map((action, index) => (
              <option key={index} value={action}>
                {actionOptions[action]}
              </option>
            ))}
          </select>
        </div>

        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleAction}
            style={{
              transition: "0.3s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Submit
          </button>
        </div>
      </div>
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
