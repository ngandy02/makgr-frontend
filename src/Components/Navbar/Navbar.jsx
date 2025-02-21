import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PAGES = [
  { label: 'Home', destination: '/' },
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
    <nav>
      <div>
        <ul className='ml-[30px] flex gap-[2rem] p-0 list-none'>
          <NavLink 
            className='home'
            page = {PAGES[0]}
          />
        </ul>
      </div>
      <div>
        <ul className='mr-[30px] flex gap-[2rem] p-0 list-none'>
          {PAGES.map((page) => 
            page.label !== 'Home' &&
              <NavLink 
                key={page.destination} 
                label={page.label}
                destination={page.destination} />)}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
