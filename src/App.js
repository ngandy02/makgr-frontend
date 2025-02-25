import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import Masterhead from './Components/Masterhead';
import Submissions from './Components/Submissions';
import About from './Components/About';
import Account from './Components/Account';
import LoginForm from './Components/Login/LoginForm';
import RegisterForm from './Components/Login/RegisterForm';

function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Router allows for react to build a SPA without reloading the 
        full page and jsut have the componenet rendered based on URL path  */}
        {/* Router used to wrpa <Route> components,
        it iterates over all Routes and renders the first on that matches
        current location */}
        {/* For a different home page, do:
         <Route index element={<Login />} /> */}
        <Route index element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />

        <Route path="" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="masterhead" element={<Masterhead />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="about" element={<About />} />
        <Route path="account" element={<Account />} />
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonPage />} />
        {/* path contains the current URL path excluding the domain name */}
        {/* element contains the Component to be rendered */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
