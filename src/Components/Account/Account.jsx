import React from "react";
// import propTypes from "prop-types";
// import axios from "axios";
// import { Link } from "react-router-dom";

// import { BACKEND_URL } from "../../constants";

function Account() {
  return (
    <div className="wrapper">
     <h1 className="text-lg font-bold">Name of Person</h1>
     <h1 className="text-md font-bold">Email</h1>
     <h1 className="text-md font-bold">Password</h1>
     <h1 className="text-md font-bold">Role</h1>
     <h1 className="text-md font-bold">Date Created</h1>

     <button className="mt-2">Manage Account</button>
    </div>
  )
}

export default Account;
