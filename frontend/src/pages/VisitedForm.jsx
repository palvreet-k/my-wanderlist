import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VisitedForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const existing = location.state;

  const [form, setForm] = useState({
    visitDate: existing?.visitDate || "",
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
      const url = existing
        ? `http://localhost:5000/api/visited/${existing._id}`
        : "http://localhost:5000/api/visited";

      const method = existing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
    <div style={{ padding: "20px" }}>
      <h2>{existing ? "✏️ Update Visited" : "✅ Add Visited Country"}</h2>

      <h3>🌍 {existing?.country}</h3>

      <form onSubmit={handleSubmit}>
        <input
          name="visitDate"
          placeholder="Visit date"
          value={form.visitDate}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
        >
          <option value="">Rating</option>
          <option value="1">⭐</option>
          <option value="2">⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
        </select>

        <br /><br />

        <textarea
          name="notes"
          placeholder="Review"
          value={form.notes}
          onChange={handleChange}
        />

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : existing
            ? "Update Visited"
            : "Add Visited"}
        </button>
      </form>
    </div>
  );
}

export default VisitedForm;