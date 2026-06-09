import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config";

const BEST_TIME_OPTIONS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];
const BUDGET_OPTIONS = ["<500", "1000", "1500", "2000", "3000", "5000+"];

function WishlistForm() {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const existing = location.state; // data for update(from Wishlist page)

  const [form, setForm] = useState({
    bestTime: existing?.bestTime || "",
    budget: existing?.budget || "",
    notes: existing?.notes || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // An existing record (with an _id) is an update; otherwise it's a new add
      const url = existing?._id
        ? `${API_BASE}/api/wishlist/${existing._id}`
        : `${API_BASE}/api/wishlist`;

      const method = existing?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: existing?.country || name,
          flag: existing?.flag || "",
          ...form,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Something went wrong");
      }

      navigate("/wishlist");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page is-centered">
      <h1 className="page-title">
        {existing?._id ? "✏️ Update Wishlist" : "⭐ Add to Wishlist"}
      </h1>

      <div className="card">
        <h3 className="form-country">🌍 {existing?.country || name}</h3>

        <form className="app-form" onSubmit={handleSubmit}>
          <div>
            <label>Best time to visit</label>
            <select name="bestTime" value={form.bestTime} onChange={handleChange}>
              <option value="">Select best time</option>
              {BEST_TIME_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Budget (USD)</label>
            <select name="budget" value={form.budget} onChange={handleChange}>
              <option value="">Select budget</option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : existing?._id ? "Update Wishlist" : "Add Wishlist"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WishlistForm;
