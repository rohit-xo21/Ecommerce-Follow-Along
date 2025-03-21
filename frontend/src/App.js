import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Signup from './pages/Signup.js';
import Shop from './pages/Shop.js';
import ProductUploadForm from './components/ProductUploadForm.js';
import Product from './pages/Product.js';
import Cart from './pages/Cart.js';
import Profile from './pages/Profile.js';
import SelectAddress from './pages/SelectAddress.js';
import OrderConfirmation from './pages/OrderConfirmation.js';
import MyOrders from './pages/MyOrder.js';
import Navigation from './components/Navbar.js';
import Footer from './components/Footer.js';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/add-product" element={<ProductUploadForm />} />
        <Route path="/edit-product/:id" element={<ProductUploadForm />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/select-address" element={<SelectAddress />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;