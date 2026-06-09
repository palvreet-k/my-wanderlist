import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import "./styles/app.css";

import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import LoginForm from "./pages/Login.jsx";
import RegisterForm from "./pages/Register.jsx";

import CountryDetails from "./pages/CountryDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import WishlistForm from "./pages/WishlistForm.jsx";
import Visited from "./pages/Visited.jsx";
import VisitedForm from "./pages/VisitedForm.jsx";

// Renders the Navbar + page only when logged in; otherwise sends to /login
function ProtectedLayout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/country/:name" element={<CountryDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/wishlist-form/:name" element={<WishlistForm />} />
          <Route path="/visited" element={<Visited />} />
          <Route path="/visited-form" element={<VisitedForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
