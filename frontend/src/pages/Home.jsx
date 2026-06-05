import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (search.length <= 2) {
      setCountries([]);
      setError("");
      return;
    }

    const fetchCountries = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/name/${search}?fields=name,capital,currencies,flags,region`
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
    <div style={{ padding: "20px" }}>
      <h1>🌍 Country Search</h1>

      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      {/* 🔵 INFO MESSAGE */}
      {search.length <= 3 && (
        <p>Type at least 4 letters to search...</p>
      )}

      {/* 🔴 ERROR MESSAGE */}
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* 🟡 LOADING */}
      {loading && <p>Loading...</p>}

      {/* 🌍 RESULTS */}
      {!loading &&
        !error &&
        search.length > 3 &&
        countries.length === 0 && (
          <p>No matching countries found</p>
        )}

      {countries.map((country, index) => (
        <div
          key={country.name.common || index}
          onClick={() =>
            navigate(`/country/${country.name.common}`)
          }
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "10px",
            cursor: "pointer",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          {/* 🇨🇦 FLAG */}
          <img
            src={country.flags?.png}
            alt={country.name?.common}
            style={{ width: "50px", height: "30px" }}
          />

          <div>
            <h3>{country.name?.common}</h3>
            <p>
              Capital: {country.capital?.[0] || "N/A"}
            </p>
            <p>
              Region: {country.region || "N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;