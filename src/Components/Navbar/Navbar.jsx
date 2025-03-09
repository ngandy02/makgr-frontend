import React from "react";
import propTypes from "prop-types";
import { Link, Outlet, useLocation } from "react-router-dom";

const PAGES = [
  { label: "MMANKWGZRZ", destination: "/" },
  { label: "Dashboard", destination: "/dashboard" },
  { label: "Masterhead", destination: "/masterhead" },
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
  const url = location.pathname;
  const page = PAGES.filter((obj) => obj.destination === url)[0];
  const label = page ? page.label : "MMANKWGZRZ";

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex items-center justify-between py-0 px-5">
        <ul className="text-3xl font-bold">
          <NavLink label={PAGES[0].label} destination={PAGES[0].destination} />
        </ul>
        <ul className="flex gap-[10px] navlinks">
          {PAGES.map(
            (page) =>
              page.label !== "MMANKWGZRZ" && (
                <NavLink key={page.destination} label={page.label} destination={page.destination} />
              )
          )}
        </ul>
      </nav>
      <main className="flex-1 flex justify-center mt-20">
        <div className="w-full max-w-4xl">
          <h1 className="font-bold text-2xl mb-4">{label}</h1>
          <div className="bg-white rounded-lg p-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Navbar;
