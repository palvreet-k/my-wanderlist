import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

function VisitedForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const existing = location.state; // data for update (from Visited page)

  const [form, setForm] = useState({
    // Convert stored ISO string to the date input YYYY-MM-DD
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

      // Existing record (with an _id) is an update
      // A new record (without an _id) is a create
      const url = existing?._id
        ? `${API_BASE}/api/visited/${existing._id}`
        : `${API_BASE}/api/visited`;

      const method = existing?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: existing?.country,
          flag: existing?.flag || "",
          ...form,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save visited");
      }

      // Mark as Visited(in Wishlist) removes entry from wishlist
      if (!existing?._id && existing?.fromWishlistId) {
        await fetch(
          `${API_BASE}/api/wishlist/${existing.fromWishlistId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      navigate("/visited");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page is-centered">
      <h1 className="page-title">
        {existing?._id ? "✏️ Update Visited" : "✅ Add Visited Country"}
      </h1>

      <div className="card">
        <h3 className="form-country">🌍 {existing?.country}</h3>

        <form className="app-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="visitDate">Visit date</label>
            <input
              id="visitDate"
              name="visitDate"
              type="date"
              value={form.visitDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="rating">Rating</label>
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
          </div>

          <div>
            <label htmlFor="notes">Notes / Review</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="How was your trip?"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : existing?._id
              ? "Update Visited"
              : "Add Visited"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VisitedForm;
