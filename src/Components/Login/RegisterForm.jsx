import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBackspace } from "react-icons/fa";
import { BACKEND_URL } from "../../constants";
import axios from "axios";

const REGISTER_ENDPOINT = `${BACKEND_URL}/register`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = (e, type) => {
    if (type === "password") setPassword(e.target.value);
    else setConfirm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(REGISTER_ENDPOINT, {
        email,
        password,
      });

      setSuccess(res.data.message || "Registration successful!");

      const person = {
        name,
        affiliation,
        email,
        roles: [],
      };

      await axios.put(PEOPLE_CREATE_ENDPOINT, person);

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong.");
      }
      setSuccess("");
    }
  };

  let message = null;
  if (hasSubmitted) {
    if (error) {
      message = <div className="text-red-600">{error}</div>;
    } else if (success) {
      message = <div className="text-green-600">{success}</div>;
    }
  }

  return (
    <div className="w-full flex items-center justify-center">
      <form className="rounded-lg p-10 w-full max-w-md" onSubmit={handleSubmit}>
        <Link className=" w-fit p-1 rounded-md" to={"/"}>
          <div className="flex gap-1 items-center">
            <FaBackspace />
            <span>Go Back</span>
          </div>
        </Link>

        <h2 className="text-center text-3xl font-bold mb-2">Sign Up</h2>

        <div>
          <label htmlFor="name">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            id="name"
            type="text"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="affiliation">Affiliation</label>
          <input
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            placeholder="Enter affiliation"
            id="affiliation"
            type="text"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            id="email"
            type="text"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => handlePasswordChange(e, "password")}
            placeholder="Enter password"
            id="password"
            type="password"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm password</label>
          <input
            value={confirm}
            onChange={(e) => handlePasswordChange(e, "confirm")}
            placeholder="Reenter password"
            id="confirm"
            type="password"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="text-center">{message}</div>

        <button
          type="submit"
          className="bg-primary text-white hover:brightness-110 transition duration-200 ease-in-out px-6 py-2 rounded"
        >
          Sign up
        </button>

        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 mt-3">Have an account?</p>
          <Link
            to={"/login"}
            className="text-sm font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
