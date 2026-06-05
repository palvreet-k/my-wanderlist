import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setWishlist(data);
  }

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
    <div style={{ padding: "20px" }}>
      <h1>⭐ Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>No countries in your wishlist yet</p>
      ) : (
        wishlist.map((item) => (
          <div
            key={item._id}
            onClick={() =>
              setExpandedId(expandedId === item._id ? null : item._id)
            }
            style={{
              border: "1px solid #ddd",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {/* HEADER */}
            <h2 style={{ margin: 0 }}>{item.country}</h2>

            {/* EXPANDED VIEW */}
            {expandedId === item._id && (
              <div style={{ marginTop: "10px" }}>
                <p>🗓 Best Time: {item.bestTime || "—"}</p>
                <p>💰 Budget: {item.budget || "—"}</p>
                <p>📝 Notes: {item.notes || "—"}</p>

                <button
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
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item._id);
                  }}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  ❌ Remove
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToVisited(item);
                  }}
                  style={{ marginLeft: "10px" }}
                >
                  ✅ Move to Visited
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;
