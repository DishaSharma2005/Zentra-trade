import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './landing_page/home/HomePage';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import SignUp from './landing_page/signup/SignUp';
import About from './landing_page/about/About';
import Pricing from './landing_page/home/Pricing';
import Product from './landing_page/products/Product';
import Support from './landing_page/support/Support';
import Footer from './landing_page/Footer';
import Navbar from './landing_page/Navbar';
import NotFound from './landing_page/NotFound';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <Navbar />
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/about' element={<About />} />
      <Route path='/pricing' element={<Pricing/>} />
      <Route path='/product' element={<Product />} />
       <Route path='/support' element={<Support/>} />
        <Route path='*' element={<NotFound />} />

    </Routes>
     <Footer />
  </BrowserRouter>
);

