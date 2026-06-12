import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import "./styles/app.css";
import { API_BASE } from "./config";

import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import LoginForm from "./pages/Login.jsx";
import RegisterForm from "./pages/Register.jsx";

import CountryDetails from "./pages/CountryDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import WishlistForm from "./pages/WishlistForm.jsx";
import Visited from "./pages/Visited.jsx";
import VisitedForm from "./pages/VisitedForm.jsx";
import Stats from "./pages/Stats.jsx";

// Validates the stored token against the backend (/api/auth/me) on load.
// Check for Invalid, expired or missing token
function ProtectedLayout() {
  const [status, setStatus] = useState(() =>
    localStorage.getItem("token") ? "checking" : "fail"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        setStatus("ok");
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStatus("fail");
      });
  }, []);

  if (status === "checking") {
    return <p className="app-page muted">Checking your session…</p>;
  }

  if (status === "fail") {
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
          <Route path="/stats" element={<Stats />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
