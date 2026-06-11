import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../config";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

function Visited() {
  const [visited, setVisited] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null); // item pending delete

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVisited() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/api/visited`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setVisited(data);
      } catch (err) {
        console.error("Error fetching visited:", err);
      }
    }

    fetchVisited();
  }, []);

  async function deleteItem(id) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE}/api/visited/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisited((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setConfirmItem(null);
    }
  }

  // Convert Date to readable local date
  function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  }

  return (
    <div className="app-page">
      <h1 className="page-title" style={{ textAlign: "center" }}>✅ Visited Countries</h1>

      {visited.length === 0 ? (
        <div className="empty-state">
          <p>No trips logged yet — your travel journal is waiting.</p>
          <Link to="/" className="btn btn-primary">
            🌍 Find a country
          </Link>
        </div>
      ) : (
        visited.map((item) => (
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
            <p className="list-meta">
              ⭐ Rating: {item.rating ? `${item.rating}/5` : "Not rated"}
            </p>

            {/* Expanded */}
            {expandedId === item._id && (
              <>
                <div className="list-detail">
                  <span>📅 Visit Date: {formatDate(item.visitDate)}</span>
                  <span>⭐ Rating: {item.rating ? `${item.rating}/5` : "—"}</span>
                  <span>📝 Notes: {item.notes || "—"}</span>
                </div>

                <div className="list-actions">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/visited-form`, { state: item });
                    }}
                  >
                    ✏️ Update
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmItem(item);
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

      <ConfirmDialog
        open={!!confirmItem}
        title="Remove from Visited?"
        message={`"${confirmItem?.country}" will be removed from your visited list.`}
        confirmText="Delete"
        onConfirm={() => deleteItem(confirmItem._id)}
        onCancel={() => setConfirmItem(null)}
      />
    </div>
  );
}

export default Visited;
