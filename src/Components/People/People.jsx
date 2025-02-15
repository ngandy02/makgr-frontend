import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
 
import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;

function AddPersonForm({
  visible,
  cancel,
  fetchPeople,
  setError,
}) {
  // original states of the peron's fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [role, setRole] = useState('');

  // event handler/functions to change the state of the person's fields
  const changeName = (event) => { setName(event.target.value); };
  const changeAffiliation = (event) => {setAffiliation(event.target.value); };
  const changeEmail = (event) => { setEmail(event.target.value); };
  const changeRole = (event) => {setRole(event.target.value); };

  // event handler/function to add a person to the database
  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: name,
      affiliation: affiliation,
      email: email,
      role: role,
    }
    axios.put(PEOPLE_CREATE_ENDPOINT, newPerson)
      .then(fetchPeople)
      .catch((error) => { setError(`There was a problem adding the person. ${error}`); });
  };

  if (!visible) return null;
  return (
    <form>
      <label htmlFor="name">
        Name
      </label>
      <input required type="text" id="name" value={name} onChange={changeName} />
      <label htmlFor="affiliation">
        Affiliation
      </label>
      <input required type="text" id="affiliation" value={affiliation} onChange={changeAffiliation} />
      <label htmlFor="email">
        Email
      </label>
      <input required type="text" id="email" value={email} onChange={changeEmail} />
      <label htmlFor="role">
        Role
      </label>
      <input required type="text" id="role" value={role} onChange={changeRole} />
      <button type="button" onClick={cancel}>Cancel</button>
      <button type="submit" onClick={addPerson}>Submit</button>
    </form>
  );
}
AddPersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
    </div>
  );
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Person({ person, fetchPeople }) {
  const { name, affiliation, email, roles} = person;

  const deletePerson = () => {
    axios.delete(`${PEOPLE_READ_ENDPOINT}/${email}`)
      .then(fetchPeople)
  }

  const updatePerson = (event) => {
    axios.put(`${PEOPLE_READ_ENDPOINT}/${email}`)
      event.preventDefault();
      const fields = {
        name: name,
        affiliation: affiliation,
        roles: roles
      }
      axios.put(`${PEOPLE_READ_ENDPOINT}/${email}`, fields)
        .then(fetchPeople)

      // .catch((error) => setError(`There was a problem updating the person. ${error}`));
  }

  return (
    <div>
      <Link to={name}>
        <div className="person-container">
          <h2>{name}</h2>
          <p>
            Email: {email}
          </p>
        </div>
      </Link>
      <button onClick={deletePerson}>Delete Person</button>
      <button onClick={updatePerson}>Update Person</button>
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

  const fetchPeople = () => { //works same as function
    axios.get(PEOPLE_READ_ENDPOINT) //axios makes a get request to the backend ep
    // fetches for the data returned from the get method of the backend peopleEP
      .then(({ data }) => { setPeople(peopleObjectToArray(data)) }) //on success (.then)
      .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`)); //on failure (.catch)
  };

  const showAddPersonForm = () => { setAddingPerson(true); };
  const hideAddPersonForm = () => { setAddingPerson(false); };

  useEffect(fetchPeople, []);
  // allows the component to fetch the list of people once right after when the component is rendered 

  return (
    <div className="wrapper">
      <header>
        <h1>
          View All People
        </h1>
        <button type="button" onClick={showAddPersonForm}>
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
      {people.map((person) => <Person key={person.name} person={person} fetchPeople={fetchPeople}/>)}
    </div>
  );
}

export default People;
