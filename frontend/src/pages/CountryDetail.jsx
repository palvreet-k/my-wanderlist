import React, { useEffect, useState } from "react";
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
      <div style={{ padding: "20px", color: "red" }}>
        <Link to="/">← Back</Link>
        <p>{error}</p>
      </div>
    );
  }

  if (!country) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">← Back</Link>

      <h1>{country.name.common}</h1>

      {/* 🇨🇦 FLAG */}
      <img
        src={country.flags?.png}
        alt={country.name?.common}
        style={{ width: "200px", marginTop: "10px" }}
      />

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

      {/* ⭐ ACTIONS */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() =>
            navigate(`/wishlist-form/${country.name.common}`)
          }
          style={{
            padding: "10px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          ⭐ Add to Wishlist
        </button>

        <button
          onClick={() =>
            navigate("/visited-form", {
              state: {
                country: country.name.common,
              },
            })
          }
          style={{
            padding: "10px",
            cursor: "pointer",
          }}
        >
          ✅ Add to Visited
        </button>
      </div>
    </div>
  );
}

export default CountryDetail;