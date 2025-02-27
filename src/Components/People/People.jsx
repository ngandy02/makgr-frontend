import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { edit, trash } from "../../assets";

import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;

function AddPersonForm({ visible, cancel, fetchPeople, setError }) {
  // original states of the peron's fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [role, setRole] = useState('');

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
  const changeRole = (event) => {
    setRole(event.target.value);
  };

  // event handler/function to add a person to the database
  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      affiliation: affiliation,
      email: email,
      role: role,
    };
    axios
      .put(PEOPLE_CREATE_ENDPOINT, newPerson)
      .then(() => {
        fetchPeople();
        setName('');
        setEmail('');
        setAffiliation('');
        setRole('');
        setError('');
        cancel();
      })
      .catch((error) => {
        setError(`There was a problem adding the person. ${error.response.data.message}`);
      });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor='name'>Name</label>
      <input required type='text' id='name' value={name} onChange={changeName} />
      <label htmlFor='affiliation'>Affiliation</label>
      <input
        required
        type='text'
        id='affiliation'
        value={affiliation}
        onChange={changeAffiliation}
      />
      <label htmlFor='email'>Email</label>
      <input required type='text' id='email' value={email} onChange={changeEmail} />
      <label htmlFor='role'>Role</label>
      <input required type='text' id='role' value={role} onChange={changeRole} />
      <button 
        onClick={cancel}
        style={{
          transition: "0.3s ease",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        onClick={addPerson}
        style={{
          transition: "0.3s ease",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
      >
        Submit
      </button>
    </form>
  );
}
AddPersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function UpdatePersonForm({ email, visible, cancel, fetchPeople, setError }) {
  // original states of the peron's fields
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [roles, setRoles] = useState([]);

  // event handler/functions to change the state of the person's fields
  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeAffiliation = (event) => {
    setAffiliation(event.target.value);
  };
  const changeRole = (event) => {
    setRoles(event.target.value.split(',').map((role) => role.trim()));
  };
  // no change email becuase you can't change the email of a person

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
      .put(`${PEOPLE_READ_ENDPOINT}/${email}`, newPerson)
      .then(() => {
        fetchPeople();
        setName('');
        setAffiliation('');
        setRoles([]);
        cancel();
        setError('');
      })
      .catch((error) => {
        setError(`There was a problem updating the person. ${error.response.data.message}`);
      });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor='name'>Name</label>
      <input required type='text' id='name' value={name} onChange={changeName} />
      <label htmlFor='affiliation'>Affiliation</label>
      <input
        required
        type='text'
        id='affiliation'
        value={affiliation}
        onChange={changeAffiliation}
      />
      <label htmlFor='role'>Role</label>
      <input required type='text' id='role' value={roles} onChange={changeRole} />
      <button 
        onClick={cancel}
        style={{
          transition: "0.3s ease",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
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
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}
      >
        Update
      </button>
    </form>
  );
}

UpdatePersonForm.propTypes = {
  email: propTypes.string.isRequired,
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function ErrorMessage({ message }) {
  return <div className='error-message'>{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Person({ person, fetchPeople, setError }) {
  const [updatingPerson, setUpdatingPerson] = useState(false);
  const { name, affiliation, email, roles } = person;

  const deletePerson = () => {
    axios
      .delete(`${PEOPLE_READ_ENDPOINT}/${email}`)
      .then(fetchPeople)
      .catch((error) => setError(`There was a problem deleting the person. ${error}`));
  };
  const showUpdatingForm = () => {
    setUpdatingPerson(true);
  };
  const hideUpdatingForm = () => {
    setUpdatingPerson(false);
  };

  return (
    <div>
        <div className="person-container">
          <h2>
            <Link to={name} className="font-bold hover:text-orange-500">
              {name}
            </Link>
          </h2>
          <p> Email: {email} </p>
          <p> Affiliation: {affiliation} </p>
          <p> Roles: {roles.join(", ")} </p>
          <div className="flex space-x-2">
            <button onClick={showUpdatingForm} className="border-none bg-transparent cursor-pointer hover:bg-gray-200 focus:bg-gray-200">
              <img src={edit} alt="Update" className="w-5 h-5" />
            </button>
            <button onClick={deletePerson} className="border-none bg-transparent cursor-pointer hover:bg-gray-200">
              <img src={trash} alt="Delete" className="w-5 h-5" />
            </button>
          </div>
        </div>
      <UpdatePersonForm
        email={email}
        visible={updatingPerson}
        cancel={hideUpdatingForm}
        fetchPeople={fetchPeople}
        setError={setError}
      />
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
};

function peopleObjectToArray(Data) {
  const keys = Object.keys(Data); // each key is a persons email
  const people = keys.map((key) => Data[key]);
  return people;
}

function People() {
  const [error, setError] = useState('');
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
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`)); //on failure (.catch)
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
    <div className='wrapper'>
      <header>
        <h1>View All People</h1>
        <button type="button" 
                onClick={showAddPersonForm} 
                style={{
                  transition: "0.3s ease",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
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
      />
      {error && <ErrorMessage message={error} />}
      {people.map((person) => (
        <Person key={person.name} person={person} fetchPeople={fetchPeople} setError={setError} />
      ))}
    </div>
  );
}

export default People;
