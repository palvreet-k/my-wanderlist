import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../config";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWishlist() {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWishlist(data);
    }

    fetchWishlist();
  }, []);

  async function removeItem(id) {
    if (!window.confirm("Remove this country from your wishlist?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_BASE}/api/wishlist/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setWishlist((prev) => prev.filter((i) => i._id !== id));
  }

  function moveToVisited(item) {
    navigate("/visited-form", {
      state: {
        country: item.country,
        flag: item.flag,
        fromWishlistId: item._id,
      },
    });
  }

  return (
    <div className="app-page">
      <h1 className="page-title" style={{ textAlign: "center" }}>⭐ Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty — no dream destinations yet.</p>
          <Link to="/" className="btn btn-primary">
            🌍 Explore countries
          </Link>
        </div>
      ) : (
        wishlist.map((item) => (
          <div
            key={item._id}
            className="card list-item"
            onClick={() =>
              setExpandedId(expandedId === item._id ? null : item._id)
            }
          >
            {/* Header */}
            <div className="list-head">
              {item.flag && (
                <img
                  className="list-flag"
                  src={item.flag}
                  alt={item.country}
                />
              )}
              <h2>{item.country}</h2>
            </div>

            {/* Expanded */}
            {expandedId === item._id && (
              <>
                <div className="list-detail">
                  <span>🗓 Best Time: {item.bestTime || "—"}</span>
                  <span>💰 Budget: {item.budget || "—"}</span>
                  <span>📝 Notes: {item.notes || "—"}</span>
                </div>

                <div className="list-actions">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/wishlist-form/${item.country}`, {
                        state: item,
                      });
                    }}
                  >
                    ✏️ Update
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveToVisited(item);
                    }}
                  >
                    ✅ Mark as Visited
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item._id);
                    }}
                  >
                    ❌ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;
