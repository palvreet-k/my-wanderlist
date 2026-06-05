import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const BEST_TIME_OPTIONS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];
const BUDGET_OPTIONS = ["<500", "1000", "1500", "2000", "3000", "5000+"];

function WishlistForm() {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const existing = location.state; // edit mode data (from Wishlist page)

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

      const url = existing
        ? `http://localhost:3000/api/wishlist/${existing._id}`
        : "http://localhost:3000/api/wishlist";

      const method = existing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: existing?.country || name,
          ...form,
        }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      navigate("/wishlist");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>{existing ? "✏️ Update Wishlist" : "⭐ Add to Wishlist"}</h2>
      <h3>🌍 {existing?.country || name}</h3>

      <form onSubmit={handleSubmit}>
        <label>Best time to visit</label>
        <br />
        <select name="bestTime" value={form.bestTime} onChange={handleChange}>
          <option value="">Select best time</option>
          {BEST_TIME_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Budget (USD)</label>
        <br />
        <select name="budget" value={form.budget} onChange={handleChange}>
          <option value="">Select budget</option>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label>Notes</label>
        <br />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <br />
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : existing ? "Update Wishlist" : "Add Wishlist"}
        </button>
      </form>
    </div>
  );
}

export default WishlistForm;
