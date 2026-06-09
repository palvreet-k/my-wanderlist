import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function CountryDetail() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [country, setCountry] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCountry() {
      try {
        setError("");

        const res = await fetch(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );

        if (!res.ok) {
          throw new Error("Country not found");
        }

        const data = await res.json();

        if (!data || data.length === 0) {
          throw new Error("No country data");
        }

        setCountry(data[0]);
      } catch (err) {
        setError(err.message);
        setCountry(null);
      }
    }

    fetchCountry();
  }, [name]);

  if (error) {
    return (
      <div className="app-page is-centered">
        <Link to="/" className="back-link">← Back</Link>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!country) return <p className="app-page muted">Loading...</p>;

  return (
    <div className="app-page is-centered">
      <Link to="/" className="back-link">← Back</Link>

      <div className="card">
        <h1 className="page-title" style={{ marginBottom: "8px" }}>
          {country.name.common}
        </h1>

        <img
          className="detail-flag"
          src={country.flags?.png}
          alt={country.name?.common}
        />

        <div className="detail-info">
          <p><b>Capital:</b> {country.capital?.[0] || "N/A"}</p>
          <p><b>Region:</b> {country.region || "N/A"}</p>
          <p>
            <b>Population:</b>{" "}
            {country.population?.toLocaleString() || "N/A"}
          </p>
          <p>
            <b>Currency:</b>{" "}
            {country.currencies
              ? Object.keys(country.currencies).join(", ")
              : "N/A"}
          </p>
        </div>

        {/* Actions */}
        <div className="list-actions">
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/wishlist-form/${country.name.common}`, {
                state: { flag: country.flags?.png },
              })
            }
          >
            ⭐ Add to Wishlist
          </button>

          <button
            className="btn btn-secondary"
            onClick={() =>
              navigate("/visited-form", {
                state: {
                  country: country.name.common,
                  flag: country.flags?.png,
                },
              })
            }
          >
            ✅ Add to Visited
          </button>
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;