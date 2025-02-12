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

function NavLink({ page }) {
  const { label, destination } = page;
  return (
    <li>
      <Link to={destination}>{label}</Link>
    </li>
  );
}
NavLink.propTypes = {
  page: propTypes.shape({
    label: propTypes.string.isRequired,
    destination: propTypes.string.isRequired,
  }).isRequired,
};

function Navbar() {
  return (
    <nav>
      <div>
        <ul className='home'>
          <NavLink 
            className='home'
            page = {PAGES[0]}
          />
        </ul>
      </div>
      <div>
        <ul className='nav-links'>
          {PAGES.map((page) => 
            page.label !== 'Home' &&
              <NavLink 
                className='nav-links'
                key={page.destination} 
                page={page}/>)}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
