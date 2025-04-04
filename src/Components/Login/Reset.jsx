import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBackspace } from "react-icons/fa";

export default function Reset() {
  const [username, setUsername] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordsNotMatching, setPasswordsNotMatching] = useState(false);

  useEffect(() => {
    if (newpassword != confirm) setPasswordsNotMatching(true);
    else setPasswordsNotMatching(false);
  }, [newpassword, confirm]);

  return (
    <div className="w-full flex items-center justify-center">
      <form className="rounded-lg border-black p-10">
        <Link className=" w-fit p-1 rounded-md" to={"/"}>
          <div className="flex gap-1 items-center">
            <FaBackspace />
            <span>Go Back</span>
          </div>
        </Link>
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
          <label htmlFor="newpassword">New Password</label>
          <input
            value={newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password"
            id="newpassword"
            type="password"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm password</label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Enter password"
            id="confirm"
            type="password"
            className="w-full rounded border p-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {passwordsNotMatching && (
          <div className="text-red-600">Passwords do not match</div>
        )}
      </form>
    </div>
  );
}
