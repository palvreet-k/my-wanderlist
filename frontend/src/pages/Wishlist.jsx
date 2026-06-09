import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWishlist() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWishlist(data);
    }

    fetchWishlist();
  }, []);

  async function removeItem(id) {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/api/wishlist/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setWishlist((prev) => prev.filter((i) => i._id !== id));
  }

  function moveToVisited(item) {
    navigate("/visited-form", {
      state: {
        country: item.country,
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
            <h2>{item.country}</h2>

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
                    ✅ Move to Visited
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item._id);
                    }}
                  >
                    ❌ Remove
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
