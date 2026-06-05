import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Visited() {
  const [visited, setVisited] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVisited();
  }, []);

  async function fetchVisited() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/visited", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setVisited(data);
    } catch (err) {
      console.error("Error fetching visited:", err);
    }
  }

  async function deleteItem(id) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:3000/api/visited/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisited((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // ISO date string -> readable local date
  function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>✅ Visited Countries</h1>

      {visited.length === 0 ? (
        <p>No visited countries yet</p>
      ) : (
        visited.map((item) => (
          <div
            key={item._id}
            onClick={() =>
              setExpandedId(expandedId === item._id ? null : item._id)
            }
            style={{
              border: "1px solid #ddd",
              marginBottom: "10px",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {/* HEADER */}
            <h2 style={{ margin: 0 }}>{item.country}</h2>

            <p style={{ fontSize: "12px", color: "gray" }}>
              ⭐ Rating: {item.rating ? `${item.rating}/5` : "Not rated"}
            </p>

            {/* EXPANDED SECTION */}
            {expandedId === item._id && (
              <div style={{ marginTop: "10px" }}>
                <p>📅 Visit Date: {formatDate(item.visitDate)}</p>
                <p>⭐ Rating: {item.rating ? `${item.rating}/5` : "—"}</p>
                <p>📝 Notes: {item.notes || "—"}</p>

                {/* UPDATE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/visited-form`, {
                      state: item,
                    });
                  }}
                  style={{ marginRight: "10px" }}
                >
                  ✏️ Update
                </button>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item._id);
                  }}
                  style={{ color: "red" }}
                >
                  ❌ Remove
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Visited;
