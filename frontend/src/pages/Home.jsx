import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

function Home() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
    </div>
  );
}

export default Home;