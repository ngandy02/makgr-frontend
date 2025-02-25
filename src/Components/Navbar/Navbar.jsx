import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PAGES = [
  { label: 'TITLE', destination: '/' },
  { label: 'Dashboard', destination: '/dashboard' },
  { label: 'Masterhead', destination: '/masterhead' },
  { label: 'Submissions', destination: '/submissions' },
  { label: 'About', destination: '/about' },
  { label: 'My Account', destination: '/account' },
  { label: 'View All People', destination: '/people' },
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
  return (
    <nav className="flex items-center justify-between px-5">
      <ul className="text-3xl font-bold">
        <NavLink label={PAGES[0].label} destination={PAGES[0].destination} />
      </ul>
      <ul className="flex gap-[10px] navlinks">
        {PAGES.map(
          (page) =>
            page.label !== 'TITLE' && (
              <NavLink
                key={page.destination}
                label={page.label}
                destination={page.destination}
              />
            )
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
