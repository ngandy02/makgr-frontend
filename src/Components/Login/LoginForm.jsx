import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full flex items-center justify-center">
      <form className="rounded-lg p-10">
        <div>
          <label htmlFor="username">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            id="username"
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
        <button
          className="mt-2"
          style={{
            transition: "0.3s ease",
          }}
        >
          Log in
        </button>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 mt-3">Forgot your password?</p>
          <Link
            to={"/reset-password"}
            className="text-sm font-medium text-primary hover:underline"
          >
            Reset password
          </Link>
          <p className="text-sm text-gray-600 mt-2">No account?</p>
          <Link
            to={"/register"}
            className="text-sm font-medium text-primary underline"
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
