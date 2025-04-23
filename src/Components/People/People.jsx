import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import axios from "axios";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";
import { useAuth } from "../../Contexts/AuthContext";

import { BACKEND_URL } from "../../constants";

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;
const ROLES_READ_ENDPOINT = `${BACKEND_URL}/roles`;

function fetchRoles(setError) {
  const [roleOptions, setRoleOptions] = useState({});

  useEffect(() => {
    axios
      .get(ROLES_READ_ENDPOINT)
      .then((response) => {
        setRoleOptions(response.data);
      })
      .catch((error) => {
        setError(`Error fetching roles: ${error.response.data.message}`);
      });
  }, [setError]);

  return roleOptions;
}

function AddPersonForm({ visible, cancel, fetchPeople, setError, setSuccess }) {
  // original states of the peron's fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [roles, setRoles] = useState([]);
  const roleOptions = fetchRoles(setError);

  // event handler/functions to change the state of the person's fields
  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeAffiliation = (event) => {
    setAffiliation(event.target.value);
  };
  const changeEmail = (event) => {
    setEmail(event.target.value);
  };
  const changeRoles = (event) => {
    const { value, checked } = event.target;
    setRoles((prevRoles) => {
      if (checked) {
        return [...prevRoles, value];
      } else {
        return prevRoles.filter((role) => role !== value);
      }
    });
  };

  // event handler/function to add a person to the database
  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      affiliation: affiliation,
      email: email,
      roles: roles,
    };
    axios
      .put(PEOPLE_CREATE_ENDPOINT, newPerson)
      .then(() => {
        fetchPeople();
        setName("");
        setEmail("");
        setAffiliation("");
        setRoles([]);
        setSuccess(`${name} added successfully!`);
        setError("");
        cancel();
      })
      .catch((error) => {
        setError(
          `There was a problem adding the person. ${error.response.data.message}`,
        );
      });
  };

  if (!visible) return null;

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        required
        type="text"
        id="name"
        value={name}
        onChange={changeName}
      />
      <label htmlFor="affiliation">Affiliation</label>
      <input
        required
        type="text"
        id="affiliation"
        value={affiliation}
        onChange={changeAffiliation}
      />
      <label htmlFor="email">Email</label>
      <input
        required
        type="text"
        id="email"
        value={email}
        onChange={changeEmail}
      />
      <label htmlFor="roles">Roles</label>
      <div id="roles">
        {Object.entries(roleOptions).map(([roleCode, roleName]) => (
          <div key={roleCode}>
            <input
              type="checkbox"
              id={roleCode}
              value={roleCode}
              checked={roles.includes(roleCode)}
              onChange={changeRoles}
            />
            <label htmlFor={roleCode}>{roleName}</label>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={cancel}
          style={{
            transition: "0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={addPerson}
          style={{
            transition: "0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
AddPersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
};

function UpdatePersonForm({
  email,
  visible,
  cancel,
  fetchPeople,
  setError,
  setSuccess,
}) {
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [roles, setRoles] = useState([]);
  const roleOptions = fetchRoles(setError);
  const { userEmail } = useAuth();
  useEffect(() => {
    if (visible) {
      // Prepopulate the fields with person's data
      axios
        .get(`${PEOPLE_READ_ENDPOINT}/${email}`)
        .then((response) => {
          const person = response.data;
          setName(person.name);
          setAffiliation(person.affiliation);
          setRoles(person.roles);
        })
        .catch((error) => {
          setError(
            `Error fetching person data: ${error.response.data.message}`,
          );
        });
    } else {
      setName("");
      setAffiliation("");
      setRoles([]);
    }
  }, [email, visible, setError]);

  // event handler/functions to change the state of the person's fields
  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeAffiliation = (event) => {
    setAffiliation(event.target.value);
  };
  const changeRoles = (event) => {
    const { value, checked } = event.target;
    setRoles((prevRoles) => {
      if (checked) {
        return [...prevRoles, value];
      } else {
        return prevRoles.filter((role) => role !== value);
      }
    });
  };

  // event handler/function to add a person to the database
  const updatePerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      affiliation: affiliation,
      email: email,
      roles: roles,
    };
    axios
      .put(`${PEOPLE_READ_ENDPOINT}/${email}`, newPerson, {
        headers: {
          Authorization: `Bearer ${userEmail ? userEmail : ""}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        fetchPeople();
        setName("");
        setAffiliation("");
        setRoles([]);
        cancel();
        setError("");
        setSuccess(`${name} updated successfully!`);
      })
      .catch((error) => {
        setError(
          `There was a problem updating the person. ${error.response.data.message}`,
        );
      });
  };

  if (!visible) return null;

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        required
        type="text"
        id="name"
        value={name}
        onChange={changeName}
      />
      <label htmlFor="affiliation">Affiliation</label>
      <input
        required
        type="text"
        id="affiliation"
        value={affiliation}
        onChange={changeAffiliation}
      />
      <label htmlFor="roles">Roles</label>
      <div id="roles">
        {Object.entries(roleOptions).map(([roleCode, roleName]) => (
          <div key={roleCode}>
            <input
              type="checkbox"
              id={roleCode}
              value={roleCode}
              checked={roles.includes(roleCode)}
              onChange={changeRoles}
            />
            <label htmlFor={roleCode}>{roleName}</label>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={cancel}
          style={{
            transition: "0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Cancel
        </button>
        {/* cancel here calls the hideUpdatingForm which is passed as prop "cancel" */}
        {/* cancel causes the visible var to become false which then makes the update form disappear
      which happens in the "Person component" which changes the state of addingPerson causing the whole People component to rerender */}
        <button
          type="submit"
          onClick={updatePerson}
          style={{
            transition: "0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Update
        </button>
      </div>
    </form>
  );
}

UpdatePersonForm.propTypes = {
  email: propTypes.string.isRequired,
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
};

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Person({ person, fetchPeople, setError, setSuccess }) {
  const [updatingPerson, setUpdatingPerson] = useState(false);
  // const { name, affiliation, email, roles } = person;
  // const roleOptions = fetchRoles(setError);
  // const roleNames = roles.map((role) => roleOptions[role]);
  const { name, affiliation, email, roles = [] } = person;
  const roleOptions = fetchRoles(setError);
  const roleNames = roles.map((role) => roleOptions[role]);
  const { userEmail } = useAuth();
  const deletePerson = () => {
    const res = confirm("Delete this person?");
    if (res) {
      axios
        .delete(`${PEOPLE_READ_ENDPOINT}/${email}`, {
          headers: {
            Authorization: `Bearer ${userEmail}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          fetchPeople();
          setSuccess(`${name} deleted successfully!`);
        })
        .catch((error) =>
          setError(`There was a problem deleting the person. ${error}`),
        );
    }
  };
  const showUpdatingForm = () => {
    setUpdatingPerson(true);
  };
  const hideUpdatingForm = () => {
    setUpdatingPerson(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-5 mb-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Affiliation:</span> {affiliation}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Roles:</span> {roleNames.join(", ")}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={updatingPerson ? hideUpdatingForm : showUpdatingForm}
            className="p-2 border-none rounded-full hover:bg-blue-100 focus:bg-blue-100 transition"
          >
            <FaPen className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={deletePerson}
            className="p-2 border-none rounded-full hover:bg-red-100 focus:bg-red-100 transition"
          >
            <FaRegTrashAlt className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      {updatingPerson && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <UpdatePersonForm
            email={email}
            visible={updatingPerson}
            cancel={hideUpdatingForm}
            fetchPeople={fetchPeople}
            setError={setError}
            setSuccess={setSuccess}
          />
        </div>
      )}
    </div>
  );
}
Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    affiliation: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    roles: propTypes.array.isRequired,
  }).isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
};

function peopleObjectToArray(Data) {
  const keys = Object.keys(Data); // each key is a persons email
  const people = keys.map((key) => Data[key]);
  return people;
}

function People() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [people, setPeople] = useState([]); // list of people dictionaries
  const [addingPerson, setAddingPerson] = useState(false);

  const fetchPeople = () => {
    //works same as function
    axios
      .get(PEOPLE_READ_ENDPOINT) //axios makes a get request to the backend ep
      // fetches for the data returned from the get method of the backend peopleEP
      .then(({ data }) => {
        setPeople(peopleObjectToArray(data));
      }) //on success (.then)
      .catch((error) =>
        setError(`There was a problem retrieving the list of people. ${error}`),
      ); //on failure (.catch)
  };

  const showAddPersonForm = () => {
    setAddingPerson(true);
  };
  const hideAddPersonForm = () => {
    setAddingPerson(false);
  };

  useEffect(fetchPeople, []);
  // allows the component to fetch the list of people once right after when the component is rendered
  return (
    <div className="mx-auto max-w-3xl px-8">
      <header className="flex justify-between items-center flex-wrap">
        <div className="text-green-700">{success}</div>
        <button
          type="button"
          onClick={addingPerson ? hideAddPersonForm : showAddPersonForm}
          style={{
            transition: "0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "0.75rem",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 8px 10px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          Add a Person
        </button>
      </header>
      <AddPersonForm
        visible={addingPerson}
        cancel={hideAddPersonForm}
        fetchPeople={fetchPeople}
        setError={setError}
        setSuccess={setSuccess}
      />
      {error && <ErrorMessage message={error} />}
      {people.map((person) => (
        <Person
          key={person.email}
          person={person}
          fetchPeople={fetchPeople}
          setError={setError}
          setSuccess={setSuccess}
        />
      ))}
    </div>
  );
}

export default People;
