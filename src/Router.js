// src/Router.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from './user';
import LogIn from './Login';
import Layout from './global/Layout';
import City from './Master/city';
import District from './Master/district';
import State from './Master/state';

// import NotFound from './pages/NotFound'; // Optional: for handling 404

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn/>} />
        <Route path="/user" element={<Layout><User /></Layout>} />
        <Route path="/city" element={<Layout><City /></Layout>} />
        <Route path='/district' element={<Layout><District/></Layout>} />
        <Route path='/state' element={<Layout><State/></Layout>} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      
      </Routes>
    </Router>
  );
};

export default AppRouter;
