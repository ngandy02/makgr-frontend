import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";

import { BACKEND_URL } from "../../constants";
import { useAuth } from "../../Contexts/AuthContext";

const MANU_ACTIVE_ENDPOINT = `${BACKEND_URL}/query/active`;
const FSM_ENDPOINT = `${BACKEND_URL}/query/handle_action`;
const STATES_ENDPOINT = `${BACKEND_URL}/query/states`;
const ACTIONS_ENDPOINT = `${BACKEND_URL}/query/actions`;
const PEOPLE_BY_ROLE_ENDPOINT = `${BACKEND_URL}/people/role`;

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

function fetchActions(setError) {
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

function fetchReferees(setError) {
  const [referees, setReferees] = useState([]);

  useEffect(() => {
    axios
      .get(`${PEOPLE_BY_ROLE_ENDPOINT}/RE`)
      .then((response) => {
        setReferees(response.data.people);
      })
      .catch((error) => {
        setError(`Error fetching referees: ${error.response.data.message}`);
      });
  }, [setError]);

  return referees;
}

function AddRefereeForm({
  fetchReferees,
  setError,
  selectedRef,
  setSelectedRef,
  referees,
}) {
  const refereeOptions = fetchReferees(setError);

  const changeReferee = (event) => {
    setSelectedRef(event.target.value);
  };

  return (
    <div>
      <label className="block font-semibold mb-2">Select Referee</label>
      {refereeOptions.map(
        (person) =>
          !referees.includes(person.email) && (
            <div key={person.email} className="mb-1">
              <input
                type="radio"
                id={person.email}
                value={person.email}
                checked={selectedRef === person.email}
                onChange={changeReferee}
              />
              <label htmlFor={person.email} className="ml-2">
                {person.name} ({person.email})
              </label>
            </div>
          )
      )}
    </div>
  );
}
AddRefereeForm.propTypes = {
  fetchReferees: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  selectedRef: propTypes.string.isRequired,
  setSelectedRef: propTypes.func.isRequired,
  referees: propTypes.array.isRequired,
};

function DeleteRefereeForm({
  fetchReferees,
  setError,
  selectedRef,
  setSelectedRef,
  referees,
}) {
  const refereeOptions = fetchReferees(setError);

  const changeReferee = (event) => {
    setSelectedRef(event.target.value);
  };

  return (
    <div>
      <label className="block font-semibold mb-2">Select Referee</label>
      {refereeOptions.map(
        (person) =>
          referees.includes(person.email) && (
            <div key={person.email} className="mb-1">
              <input
                type="radio"
                id={person.email}
                value={person.email}
                checked={selectedRef === person.email}
                onChange={changeReferee}
              />
              <label htmlFor={person.email} className="ml-2">
                {person.name} ({person.email})
              </label>
            </div>
          )
      )}
    </div>
  );
}
DeleteRefereeForm.propTypes = AddRefereeForm.propTypes;

function Manuscript({ manuscript, fetchManuscripts, setError, setSuccess }) {
  const { _id, title, author, author_email, referees, state } = manuscript;

  const { userEmail } = useAuth();
  const stateOptions = fetchStates(setError);
  const stateName = stateOptions[state];
  const actionOptions = fetchActions(setError);

  const [selectedAction, setSelectedAction] = useState("");
  const [validActions, setValidActions] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [canChoose, setCanChoose] = useState(false);

  useEffect(() => {
    if (_id && userEmail) {
      axios
        .get(`${BACKEND_URL}/query/can_choose_action`, {
          params: { manu_id: _id, user_email: userEmail },
        })
        .then((res) => {
          setCanChoose(res.data === true);
        })
        .catch((err) => {
          console.error("Permission check failed:", err);
          setCanChoose(false);
        });
    }
  }, [_id, userEmail]);

  const handleAction = () => {
    const thisManu = {
      _id: _id,
      action: selectedAction,
      referees: selectedRef,
    };

    axios
      .put(FSM_ENDPOINT, thisManu)
      .then(() => {
        fetchManuscripts();
        setSuccess(
          `${title} performed "${actionOptions[selectedAction]}" successfully!`
        );
        setSelectedAction("");
      })
      .catch((error) =>
        setError(
          `There was a problem performing action on the manuscript. ${error}`
        )
      );
  };

  const fetchValidActions = () => {
    if (!userEmail || !_id) return;

    axios
      .get(`${ACTIONS_ENDPOINT}`, {
        params: {
          user_email: userEmail,
          manu_id: _id,
        },
      })
      .then((response) => {
        const actions = response.data;
        if (Array.isArray(actions)) {
          setValidActions(actions);
        } else {
          console.warn("Expected an array but got:", actions);
          setValidActions([]);
        }
      })
      .catch((error) => {
        setError(
          `Error fetching valid actions: ${
            error.response?.data?.message || error.message
          }`
        );
      });
  };

  useEffect(fetchValidActions, [state]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 mb-4 border border-gray-200 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            <Link
              to={`${_id}`}
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

        {canChoose && (
          <div className="flex flex-col items-end space-y-4">
            <div>
              <label className="block font-semibold">Choose Action:</label>
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

            {selectedAction === "ARF" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <AddRefereeForm
                  fetchReferees={fetchReferees}
                  setError={setError}
                  selectedRef={selectedRef}
                  setSelectedRef={setSelectedRef}
                  referees={referees}
                />
              </div>
            )}
            {selectedAction === "DRF" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <DeleteRefereeForm
                  fetchReferees={fetchReferees}
                  setError={setError}
                  selectedRef={selectedRef}
                  setSelectedRef={setSelectedRef}
                  referees={referees}
                />
              </div>
            )}

            <div>
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
        )}
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
    text: propTypes.string.isRequired,
  }).isRequired,
  fetchManuscripts: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
};

function Dashboard() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [manuscripts, setManuscripts] = useState([]);
  const { userEmail } = useAuth();

  const fetchManuscripts = () => {
    if (!userEmail) {
      setError("User email not found.");
      return;
    }

    axios
      .get(`${MANU_ACTIVE_ENDPOINT}/${userEmail}`)
      .then(({ data }) => {
        setManuscripts(data);
      })
      .catch((error) =>
        setError(`There was a problem retrieving active manuscripts. ${error}`)
      );
  };

  useEffect(fetchManuscripts, [userEmail]);

  return (
    <div className="wrapper">
      <div className="text-green-700">{success}</div>
      {error && <ErrorMessage message={error} />}
      {manuscripts.map(
        (manuscript) =>
          manuscript.state !== "WDN" && (
            <Manuscript
              key={`${manuscript._id}-${manuscript.state}`}
              manuscript={manuscript}
              fetchManuscripts={fetchManuscripts}
              setError={setError}
              setSuccess={setSuccess}
            />
          )
      )}
    </div>
  );
}

export default Dashboard;
