import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './landing_page/home/HomePage';
import SignUp from './auth/signup';
import Login from './auth/Login';
import About from './landing_page/about/About';
import Pricing from './landing_page/pricing/Pricing';
import Product from './landing_page/products/Product';
import Support from './landing_page/support/Support';
import Footer from './landing_page/Footer';
import Navbar from './landing_page/Navbar';
import NotFound from './landing_page/NotFound';

import ProtectedRoute from './auth/ProtectedRoute';
// import Dashboard from './dashboard/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Navbar />

    <Routes>
      {/* LANDING */}
      <Route path='/' element={<HomePage />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/about' element={<About />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/product' element={<Product />} />
      <Route path='/support' element={<Support />} />

      {/* DASHBOARD (PROTECTED) */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            {/* <Dashboard /> */}
            <h2>Dashboard</h2>
          </ProtectedRoute>
        }
      />

      <Route path='*' element={<NotFound />} />
    </Routes>

    <Footer />
  </BrowserRouter>
);
