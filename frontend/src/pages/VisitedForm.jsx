import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VisitedForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const existing = location.state; // edit mode data (from Visited / Wishlist page)

  const [form, setForm] = useState({
    // a stored date comes back as an ISO string; the date input needs YYYY-MM-DD
    visitDate: existing?.visitDate ? existing.visitDate.slice(0, 10) : "",
    rating: existing?.rating || "",
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

      // Only an existing record (with an _id) is an update; coming from a
      // country/wishlist we only have { country }, so that's a new entry.
      const url = existing?._id
        ? `http://localhost:3000/api/visited/${existing._id}`
        : "http://localhost:3000/api/visited";

      const method = existing?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: existing?.country,
          ...form,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save visited");
      }

      navigate("/visited");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>{existing?._id ? "✏️ Update Visited" : "✅ Add Visited Country"}</h2>
      <h3>🌍 {existing?.country}</h3>

      <form onSubmit={handleSubmit}>
        <label htmlFor="visitDate">Visit date</label>
        <br />
        <input
          id="visitDate"
          name="visitDate"
          type="date"
          value={form.visitDate}
          onChange={handleChange}
        />

        <br />
        <br />

        <label htmlFor="rating">Rating</label>
        <br />
        <select
          id="rating"
          name="rating"
          value={form.rating}
          onChange={handleChange}
        >
          <option value="">Select rating</option>
          <option value="1">⭐</option>
          <option value="2">⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
        </select>

        <br />
        <br />

        <label htmlFor="notes">Notes / Review</label>
        <br />
        <textarea
          id="notes"
          name="notes"
          placeholder="How was your trip?"
          value={form.notes}
          onChange={handleChange}
        />

        <br />
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : existing?._id
            ? "Update Visited"
            : "Add Visited"}
        </button>
      </form>
    </div>
  );
}

export default VisitedForm;
