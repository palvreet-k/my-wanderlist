import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import LoginForm from "./pages/Login.jsx";
import RegisterForm from "./pages/Register.jsx";

import CountryDetails from "./pages/CountryDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import WishlistForm from "./pages/WishlistForm.jsx";
import Visited from "./pages/Visited.jsx";
import VisitedForm from "./pages/VisitedForm.jsx";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Country */}
        <Route path="/country/:name" element={<CountryDetails />} />

        {/* Wishlist */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/wishlist-form/:name" element={<WishlistForm />} />

        {/* Visited */}
        <Route path="/visited" element={<Visited />} />
        <Route path="/visited-form" element={<VisitedForm />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;