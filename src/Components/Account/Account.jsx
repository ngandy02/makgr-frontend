import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";

const ROLES_READ_ENDPOINT = `${BACKEND_URL}/roles`;
const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;

function Account() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFromVisible, setIsFormVisible] = useState(false);

  return (
    <div className="wrapper">
      {error && <div className="error-message">{error}</div>}
      <div className="text-green-700">{success}</div>

      <h1 className="text-lg font-bold">Name of Person</h1>
      <h1 className="text-md font-bold">Email</h1>
      <h1 className="text-md font-bold">Password</h1>
      <h1 className="text-md font-bold">Role</h1>
      <h1 className="text-md font-bold">Date Created</h1>

      <button
        className="mt-2"
        onClick={() => setIsFormVisible((prev) => !prev)}
      >
        Manage Account
      </button>

      {isFromVisible && (
        <UpdatePersonForm setError={setError} setSuccess={setSuccess} />
      )}
    </div>
  );
}

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

function UpdatePersonForm({ setError, setSuccess }) {
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [roles, setRoles] = useState([]);
  const roleOptions = fetchRoles(setError);
  const { userEmail } = useAuth();
  useEffect(() => {
    // Prepopulate the fields with person's data
    axios
      .get(`${PEOPLE_READ_ENDPOINT}/${userEmail}`)
      .then((response) => {
        const person = response.data;
        setName(person.name);
        setAffiliation(person.affiliation);
        setRoles(person.roles);
      })
      .catch((error) => {
        setError(`Error fetching person data: ${error.response.data.message}`);
      });
  }, [userEmail, setError]);

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
      email: userEmail,
      roles: roles,
    };
    axios
      .put(`${PEOPLE_READ_ENDPOINT}/${userEmail}`, newPerson, {
        headers: {
          Authorization: `Bearer ${userEmail ? userEmail : ""}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setError("");
        setSuccess(`${name} updated successfully!`);
      })
      .catch((error) => {
        console.log(error);
        setError(
          `There was a problem updating the person. ${error.response.data.message}`,
        );
      });
  };

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
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
};

export default Account;
