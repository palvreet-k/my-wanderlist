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
    <nav className="navbar">
      {/* LEFT - brand + tabs */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          WanderList 🌍
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/visited">Visited</Link>
        </div>
      </div>

      {/* RIGHT - welcome + logout */}
      <div className="navbar-right">
        <span className="navbar-user">Welcome {user?.username || "Guest"}</span>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;