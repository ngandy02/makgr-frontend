import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordsNotMatching, setPasswordsNotMatching] = useState(false);

  const handlePasswordChange = (e, type) => {
    if (type === "password") setPassword(e.target.value);
    else setConfirm(e.target.value);
  };

  useEffect(() => {
    if (password && confirm && password !== confirm) setPasswordsNotMatching(true);
    else setPasswordsNotMatching(false);
  }, [password, confirm]);

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
            placeholder="Enter password"
            id="confirm"
            type="password"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {passwordsNotMatching && <div className="text-red-600">Passwords do not match</div>}
        <button
          className="mt-2"
          style={{
            transition: "0.3s ease",
          }}
        >
          Sign up
        </button>
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 mt-3">Have an account?</p>
          <Link to={"/"} className="text-sm font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
