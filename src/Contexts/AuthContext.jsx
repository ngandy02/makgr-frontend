import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [userName, setUserName] = useState("");

  // Get name of user using their email
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${BACKEND_URL}/people/${userEmail}`)
        .then((res) => {
          if (res.data?.name) {
            setUserName(res.data.name);
          } else {
            setUserName(userEmail);
          }
        })
        .catch(() => {
          setUserName(userEmail);
        });
    } else {
      setUserName("");
    }
  }, [userEmail]);

  const logIn = (email) => {
    localStorage.setItem("userEmail", email);
    setUserEmail(email);
  };

  const logOut = () => {
    localStorage.removeItem("userEmail");
    setUserEmail(null);
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ userEmail, userName, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
