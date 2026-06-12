import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../config";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

// Get only number from budget string
const budgetValue = (b) => {
  const n = parseInt(String(b).replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
};

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmItem, setConfirmItem] = useState(null); // item pending delete
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
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
    const token = localStorage.getItem("token");

    await fetch(`${API_BASE}/api/wishlist/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setWishlist((prev) => prev.filter((i) => i._id !== id));
    setConfirmItem(null);
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

  // Approximate total budget
  const totalBudget = wishlist.reduce((sum, item) => sum + budgetValue(item.budget), 0);

  // Filter by search + sort by budget
  const view = wishlist
    .filter((i) =>
      (i.country || "").toLowerCase().includes(search.trim().toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "budget-asc") return budgetValue(a.budget) - budgetValue(b.budget);
      if (sort === "budget-desc") return budgetValue(b.budget) - budgetValue(a.budget);
      return 0;
    });

  return (
    <div className="app-page">
      <h1 className="page-title" style={{ textAlign: "center" }}>
        ⭐ Wishlist
        {wishlist.length > 0 && (
          <span className="budget-badge">💰 ~${totalBudget.toLocaleString()}</span>
        )}
      </h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty — no dream destinations yet.</p>
          <Link to="/" className="btn btn-primary">
            🌍 Explore countries
          </Link>
        </div>
      ) : (
        <>
          <div className="list-controls">
            <input
              type="text"
              placeholder="Search wishlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Recently added</option>
              <option value="budget-asc">Budget: Low → High</option>
              <option value="budget-desc">Budget: High → Low</option>
            </select>
          </div>

          {view.length === 0 ? (
            <p className="muted">No countries match your search.</p>
          ) : (
            view.map((item) => (
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
        </>
      )}

      <ConfirmDialog
        open={!!confirmItem}
        title="Remove from Wishlist?"
        message={`"${confirmItem?.country}" will be removed from your wishlist.`}
        confirmText="Delete"
        onConfirm={() => removeItem(confirmItem._id)}
        onCancel={() => setConfirmItem(null)}
      />
    </div>
  );
}

export default Wishlist;
