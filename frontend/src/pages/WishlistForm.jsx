import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function WishlistForm() {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const existing = location.state; // 👈 edit mode data

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
      const url = existing
        ? `http://localhost:3000/api/wishlist/${existing._id}`
        : "http://localhost:3000/api/wishlist";

      const method = existing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
        <input
          name="bestTime"
          placeholder="Best time to visit"
          value={form.bestTime}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="budget"
          value={form.budget}
          onChange={handleChange}
        >
          <option value="">Select budget</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <br /><br />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : existing ? "Update Wishlist" : "Add Wishlist"}
        </button>
      </form>
    </div>
  );
}

export default WishlistForm;