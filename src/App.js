import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import Masterhead from './Components/Masterhead';
import Submissions from './Components/Submissions';
import About from './Components/About';
import Account from './Components/Account';


function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* For a different home page, do:
         <Route index element={<Login />} /> */}
        <Route path="" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="masterhead" element={<Masterhead />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="about" element={<About />} />
        <Route path="account" element={<Account />} />
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
