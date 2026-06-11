import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../config";

function Home() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [wishlist, setWishlist] = useState([]);
  const [visited, setVisited] = useState([]);

  const navigate = useNavigate();

  // Load a glimpse of the user's lists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const opts = { headers: { Authorization: `Bearer ${token}` } };

    fetch(`${API_BASE}/api/wishlist`, opts)
      .then((r) => (r.ok ? r.json() : []))
      .then(setWishlist)
      .catch(() => {});

    fetch(`${API_BASE}/api/visited`, opts)
      .then((r) => (r.ok ? r.json() : []))
      .then(setVisited)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      if (search.length <= 2) {
        setCountries([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_BASE}/api/countries/search/${encodeURIComponent(search)}`
        );

        if (!res.ok) {
          throw new Error("No countries found");
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No results found");
        }

        setCountries(data);
      } catch (err) {
        setCountries([]);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCountries, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="app-page is-centered">
      <h1 className="page-title">🌍 Where to next?</h1>

      <p className="home-intro">
        Search any country, then save it to your <strong>Wishlist</strong> or mark
        it as <strong>Visited</strong> — your own travel bucket list, all in one place.
      </p>

      <div className="home-steps">
        <span><strong>1</strong> Search a country</span>
        <span><strong>2</strong> Save to Wishlist or Visited</span>
        <span><strong>3</strong> Track your travels</span>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search a country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search.length <= 2 && (
        <p className="muted" style={{ marginTop: "12px" }}>
          Type at least 3 letters to search...
        </p>
      )}

      {error && (
        <p className="error-text" style={{ marginTop: "12px" }}>
          {error}
        </p>
      )}

      {loading && (
        <p className="muted" style={{ marginTop: "12px" }}>
          Loading...
        </p>
      )}

      {!loading &&
        !error &&
        search.length > 3 &&
        countries.length === 0 && (
          <p className="muted" style={{ marginTop: "12px" }}>
            No matching countries found
          </p>
        )}

      {countries.map((country, index) => (
        <div
          key={country.name.common || index}
          className="card result-card"
          onClick={() => navigate(`/country/${country.name.common}`)}
        >
          <img
            className="result-flag"
            src={country.flags?.png}
            alt={country.name?.common}
          />

          <h3 className="result-name">{country.name?.common}</h3>

          <div className="result-meta">
            <p><b>Capital:</b> {country.capital?.[0] || "N/A"}</p>
            <p><b>Region:</b> {country.region || "N/A"}</p>
          </div>
        </div>
      ))}

      {/* lists not shown when search is active*/}
      {search.length <= 2 && (wishlist.length > 0 || visited.length > 0) && (
        <div className="home-lists">
          {wishlist.length > 0 && (
            <section className="glimpse-card">
              <div className="glimpse-head">
                <h3>⭐ Wishlist</h3>
                <Link to="/wishlist">View all →</Link>
              </div>
              <div className="glimpse-list">
                {wishlist.slice(0, 5).map((item) => (
                  <div className="glimpse-item" key={item._id}>
                    {item.flag && <img src={item.flag} alt="" />}
                    <span>{item.country}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {visited.length > 0 && (
            <section className="glimpse-card">
              <div className="glimpse-head">
                <h3>✅ Visited</h3>
                <Link to="/visited">View all →</Link>
              </div>
              <div className="glimpse-list">
                {visited.slice(0, 5).map((item) => (
                  <div className="glimpse-item" key={item._id}>
                    {item.flag && <img src={item.flag} alt="" />}
                    <span>{item.country}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;