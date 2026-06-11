// routes/countries.js
// Proxies REST Countries v5 (key kept server-side) and maps the response to the
// shape the frontend already expects.

import express from 'express';

const router = express.Router();

const V5_URL = 'https://api.restcountries.com/countries/v5';

async function searchV5(query) {
  if (!process.env.RESTCOUNTRIES_KEY) {
    throw new Error('RESTCOUNTRIES_KEY is not set');
  }

  const res = await fetch(`${V5_URL}?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${process.env.RESTCOUNTRIES_KEY}` }
  });
  if (!res.ok) throw new Error(`REST Countries v5 returned ${res.status}`);

  const data = await res.json();
  return data?.data?.objects || [];
}

// Map a v5 country object to the shape the frontend uses.
function shape(o) {
  return {
    name: { common: o.names?.common || '' },
    capital: o.capitals || [],
    region: o.region || '',
    population: o.population || 0,
    currencies: (o.currencies || []).map((c) => c.code), // e.g. ["CAD", "USD"]
    flags: { png: o.flag?.url_png || '' }
  };
}

// GET /api/countries/search/:q  -> array of matches
router.get('/search/:q', async (req, res) => {
  try {
    const objects = await searchV5(req.params.q);
    res.json(objects.slice(0, 20).map(shape));
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'Country search unavailable' });
  }
});

// GET /api/countries/detail/:name  -> single country (exact match, else first result)
router.get('/detail/:name', async (req, res) => {
  try {
    const objects = await searchV5(req.params.name);
    const q = req.params.name.toLowerCase();
    const found =
      objects.find((o) => o.names?.common?.toLowerCase() === q) || objects[0];

    if (!found) return res.status(404).json({ message: 'Country not found' });
    res.json(shape(found));
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'Country not found' });
  }
});

export default router;
