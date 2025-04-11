import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";

const LOGIN_ENDPOINT = `${BACKEND_URL}/login`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const navigate = useNavigate();
  const { logIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(LOGIN_ENDPOINT, { email, password });

      setSuccess(res.data.message || "Login successful!");
      logIn(email);

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form className="rounded-lg p-10 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-center text-3xl font-bold mb-2">Log In</h2>

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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            id="password"
            type="password"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="text-center">
          {hasSubmitted && error && <div className="text-red-600">{error}</div>}
          {hasSubmitted && success && (
            <div className="text-green-600">{success}</div>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary text-white hover:brightness-110 transition duration-200 ease-in-out px-6 py-2 rounded"
        >
          Log In
        </button>

        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 mt-3">Don’t have an account?</p>
          <Link
            to={"/register"}
            className="text-sm font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
