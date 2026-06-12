import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";

const BUDGET_ORDER = ["<500", "1000", "1500", "2000", "3000", "5000+"];
const BUDGET_LABEL = {
  "<500": "< $500",
  "1000": "$1,000",
  "1500": "$1,500",
  "2000": "$2,000",
  "3000": "$3,000",
  "5000+": "$5,000+",
  "Not set": "Not set",
};


const PIE_COLORS = ["#f59e0b", "#fb923c", "#10b981", "#0ea5e9", "#8b5cf6", "#94a3b8"];

// Pie chart — wishlist budget
function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const segments = data.map((d, i) => {
    const before = data.slice(0, i).reduce((s, x) => s + x.value, 0);
    const start = (before / total) * 100;
    const end = ((before + d.value) / total) * 100;
    return `${PIE_COLORS[i % PIE_COLORS.length]} ${start}% ${end}%`;
  });
  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div className="pie-wrap">
      <div className="pie" style={{ background: gradient }} />
      <ul className="pie-legend">
        {data.map((d, i) => (
          <li key={d.label}>
            <span
              className="pie-dot"
              style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
            />
            {d.label} — {d.value} ({Math.round((d.value / total) * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}

// Horizontal bars — visited by year
function YearBars({ data, color }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="chart">
      {data.map((d) => (
        <div className="chart-row" key={d.label}>
          <span className="chart-label">{d.label}</span>
          <div className="chart-track">
            <div
              className="chart-bar"
              style={{ width: `${(d.value / max) * 100}%`, background: color }}
            />
          </div>
          <span className="chart-value">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

// Main stats page
function Stats() {
  const [wishlist, setWishlist] = useState([]);
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const load = (path, set) =>
      fetch(`${API_BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : []))
        .then(set)
        .catch(() => {});

    load("/api/wishlist", setWishlist);
    load("/api/visited", setVisited);
  }, []);

  // Get Wishlist data grouped by budget
  const budgetCounts = {};
  wishlist.forEach((i) => {
    const b = i.budget || "Not set";
    budgetCounts[b] = (budgetCounts[b] || 0) + 1;
  });
  const budgetData = [...BUDGET_ORDER, "Not set"]
    .map((b) => ({ label: BUDGET_LABEL[b] || b, value: budgetCounts[b] || 0 }))
    .filter((d) => d.value > 0);

  // Get Visited data grouped by year
  const yearCounts = {};
  visited.forEach((i) => {
    const y = i.visitDate ? new Date(i.visitDate).getFullYear() : "No date";
    yearCounts[y] = (yearCounts[y] || 0) + 1;
  });
  const visitedData = Object.entries(yearCounts)
    .sort((a, b) => {
      if (a[0] === "No date") return 1;
      if (b[0] === "No date") return -1;
      return Number(a[0]) - Number(b[0]);
    })
    .map(([label, value]) => ({ label: String(label), value }));

  const totalBudget = wishlist.reduce((sum, item) => {
    const n = parseInt(String(item.budget).replace(/[^0-9]/g, ""), 10);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);

  const hasData = wishlist.length > 0 || visited.length > 0;

  return (
    <div className="app-page">
      <h1 className="page-title" style={{ textAlign: "center" }}>📊 Travel Stats</h1>

      {!hasData ? (
        <div className="empty-state">
          <p>No data yet — add some countries to see your stats.</p>
          <Link to="/" className="btn btn-primary">🌍 Explore countries</Link>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-num">{wishlist.length}</span>
              <span className="stat-label">Wishlist</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{visited.length}</span>
              <span className="stat-label">Visited</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">~${totalBudget.toLocaleString()}</span>
              <span className="stat-label">Est. wishlist budget</span>
            </div>
          </div>

          {/* Wishlist by budget */}
          <div className="card chart-card">
            <h3 className="chart-title">⭐ Wishlist countries by budget</h3>
            {budgetData.length > 0 ? (
              <PieChart data={budgetData} />
            ) : (
              <p className="muted">No wishlist countries yet.</p>
            )}
          </div>

          {/* Visited by year */}
          <div className="card chart-card">
            <h3 className="chart-title">✅ Visited countries by year</h3>
            {visitedData.length > 0 ? (
              <YearBars data={visitedData} color="#059669" />
            ) : (
              <p className="muted">No visited countries yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Stats;
