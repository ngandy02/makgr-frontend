import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "../../constants";

const HOME_LABEL = "Published Manuscripts";

const PAGES = [
  { label: "Home", destination: "/" },
  { label: "Dashboard", destination: "/dashboard" },
  { label: "Masthead", destination: "/masthead" },
  { label: "Submissions", destination: "/submissions" },
  { label: "About", destination: "/about" },
  { label: "My Account", destination: "/account" },
  { label: "View All People", destination: "/people" },
];

function NavLink({ label, destination }) {
  return (
    <li>
      <Link to={destination}>{label}</Link>
    </li>
  );
}

NavLink.propTypes = {
  label: propTypes.string.isRequired,
  destination: propTypes.string.isRequired,
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname;
  const page = PAGES.find((obj) => obj.destination === url);
  const label = page ? page.label : "";

  const { userEmail, userName, logOut } = useAuth();
  const [canViewPeople, setCanViewPeople] = useState(false);

  const handleSignOut = () => {
    logOut();
    navigate("/login");
  };

  const allowedPathsForGuests = ["/", "/masthead", "/submissions", "/about"];

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${BACKEND_URL}/permissions`, {
          params: {
            feature: "people",
            action: "read",
            user_email: userEmail,
          },
        })
        .then((res) => {
          setCanViewPeople(res.data.permitted);
        })
        .catch((err) => {
          console.error("Permission check for people read failed:", err);
          setCanViewPeople(false);
        });
    } else {
      setCanViewPeople(false);
    }
  }, [userEmail]);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-5 py-2 flex items-center justify-between">
        <ul className="text-3xl font-bold">
          <li>
            <Link to="/">MMANKWGZRZ</Link>
          </li>
        </ul>
        <ul className="flex gap-[10px] navlinks">
          {PAGES.filter((page) => {
            if (!userEmail) {
              return allowedPathsForGuests.includes(page.destination);
            }
            if (page.destination === "/people") {
              return canViewPeople;
            }
            return true;
          }).map((page) => (
            <NavLink
              key={page.destination}
              label={page.label}
              destination={page.destination}
            />
          ))}
        </ul>
        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <span className="text-sm font-semibold text-gray-700">
                Welcome, {userName}
              </span>
              <button onClick={handleSignOut} className="button-primary">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 border border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 font-semibold rounded-xl bg-primary text-white hover:bg-opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-1 flex justify-center pt-32 mb-20 px-4">
        <div className="w-full max-w-4xl">
          <h1 className="font-bold text-2xl mb-4">
            {label === "Home" ? HOME_LABEL : label}
          </h1>
          <div className="bg-white rounded-lg p-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Navbar;
