import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    // Drop JWT token and user info (welcome tag)at logout
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* LEFT - Tabs */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/visited">Visited</Link>
      </div>

      {/* CENTER - Welcome */}
      <div>
        <strong>Welcome {user?.username || "Guest"}</strong>
      </div>

      {/* RIGHT - Logout */}
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;