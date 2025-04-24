import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ROLES_READ_ENDPOINT = `${BACKEND_URL}/roles`;
const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const ACC_ENDPOINT = `${BACKEND_URL}/account`;
const CHANGE_PW_ENDPOINT = `${ACC_ENDPOINT}/password`;

function Account() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFromVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [roles, setRoles] = useState([]);
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
  }, [userEmail]);

  return (
    <div className="wrapper">
      {error && <div className="error-message">{error}</div>}
      <div className="text-green-700">{success}</div>

      <h1 className="text-lg font-bold">{name}</h1>
      <h1 className="text-md font-bold">{userEmail}</h1>
      <h1 className="text-md font-bold">
        Roles:{" "}
        {roles.map((role, i) => (
          <span key={role}>
            {role}
            {i + 1 < roles.length ? "," : ""}
          </span>
        ))}
      </h1>

      <button
        className="mt-2"
        onClick={() => setIsFormVisible((prev) => !prev)}
      >
        Manage Account
      </button>

      {isFromVisible && (
        <div className="space-y-4 mt-2">
          <UpdatePersonForm
            setError={setError}
            setSuccess={setSuccess}
            setName={setName}
            name={name}
            setAffiliation={setAffiliation}
            setRoles={setRoles}
            roles={roles}
            affiliation={affiliation}
          />
          <ChangePasswordForm />
          <DeleteAccountButton />
        </div>
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

function UpdatePersonForm({
  setError,
  setSuccess,
  setName,
  name,
  setAffiliation,
  setRoles,
  roles,
  affiliation,
}) {
  const roleOptions = fetchRoles(setError);
  const { userEmail } = useAuth();

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
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
  setName: propTypes.func.isRequired,
  name: propTypes.string,
  setAffiliation: propTypes.func.isRequired,
  setRoles: propTypes.func.isRequired,
  roles: propTypes.array,
  affiliation: propTypes.string,
};

ChangePasswordForm.propTypes = {
  setError: propTypes.func.isRequired,
  setSuccess: propTypes.func.isRequired,
};

export default Account;

function ChangePasswordForm() {
  const { userEmail } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    try {
      const res = await axios.post(`${CHANGE_PW_ENDPOINT}`, payload, {
        headers: {
          Authorization: `Bearer ${userEmail ? userEmail : ""}`,
          "Content-Type": "application/json",
        },
      });
      setError("");
      setSuccess(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (e) {
      setSuccess("");
      setError(e.response.data.message);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <div className="text-green-700">{success}</div>
      <form onSubmit={onSubmit}>
        <label htmlFor="oldPw">Old Password</label>
        <input
          required
          type="password"
          id="oldPw"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label htmlFor="newPw">New Password</label>
        <input
          required
          type="password"
          id="newPw"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          type="submit"
          className="self-start"
          style={{
            transition: "0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Update
        </button>
      </form>
    </div>
  );
}

function DeleteAccountButton() {
  const { userEmail, logOut } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onClick = async () => {
    const isConfirmed = confirm("Delete your account?");
    if (!isConfirmed) return;
    try {
      const res = await axios.delete(`${ACC_ENDPOINT}/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${userEmail ? userEmail : ""}`,
          "Content-Type": "application/json",
        },
      });
      setError("");
      setSuccess(res.data.message);
      logOut();
      navigate("/");
    } catch (e) {
      setSuccess("");
      setError(e.response.data.message);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <div className="text-green-700">{success}</div>
      <button
        className="bg-red-500 text-white border-red-500 hover:bg-red-600"
        onClick={onClick}
      >
        Delete Account
      </button>
    </div>
  );
}
