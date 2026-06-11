# WanderList 🌍

A full-stack travel bucket-list app. Search countries (REST Countries API), save them to a **Wishlist**, and log the ones you've **Visited** — each user has their own private lists, secured with JWT auth.

**🔗 Live demo:** https://my-wanderlist-1.onrender.com
*(Free-tier backend sleeps when idle — the first request after inactivity may take ~30–60s to wake.)*

- **Frontend:** React + Vite, React Router, plain CSS
- **Backend:** Node.js + Express, Passport-JWT, bcrypt
- **Database:** MongoDB Atlas (Mongoose)
- **External API:** REST Countries v3.1 (search, flags, details)

---

## 📁 Project Structure

```bash
my-wanderlist/
├── backend/      # Express REST API (JWT auth, wishlist/visited CRUD)
├── frontend/     # React + Vite app
└── docs/         # Proposal + architecture diagram (Wander_architecture.excalidraw)
```

---

## ✨ Features

- Register / log in with username + password (JWT, 7-day token)
- Search countries by name; view flag, region, capital, currency, population
- Add a country to your **Wishlist** (best time to visit, budget, notes)
- Mark a country as **Visited** (visit date, star rating, notes)
- Move a wishlist country to Visited; edit or delete entries
- Per-user data — every list is scoped to the logged-in user

---

## 🚀 Running the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
```

> **MongoDB Atlas:** add your IP under **Network Access** (use `0.0.0.0/0` for dev).

Start it:

```bash
npm run dev      # nodemon (auto-reload)
# or: npm start
```

Backend runs on **http://localhost:3000**.
⚠️ Avoid port 5000 on macOS — it's used by AirPlay/Control Center.

### API routes
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create a user |
| POST | `/api/auth/login` | – | Log in → returns `{ token, user }` |
| GET | `/api/auth/me` | JWT | Return the current user |
| GET/POST/PUT/DELETE | `/api/wishlist` | JWT | Wishlist CRUD |
| GET/POST/PUT/DELETE | `/api/visited` | JWT | Visited CRUD |

Protected routes require an `Authorization: Bearer <token>` header.

---

## 💻 Running the Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` for local dev:

```env
VITE_API_URL=http://localhost:3000
```

Start it:

```bash
npm run dev
```

Frontend runs on **http://localhost:5173** (Vite). Requires **Node 20.19+ / 22.x**.

---

## ☁️ Deployment (Render)

Both services run on Render:

- **Frontend** (Static Site) — https://my-wanderlist-1.onrender.com
  Root `frontend`, build `npm install && npm run build`, publish `dist`. Env: `VITE_API_URL=https://my-wanderlist.onrender.com`. Add a **Rewrite** rule `/* → /index.html` so client-side routes work on refresh.
- **Backend** (Web Service) — https://my-wanderlist.onrender.com
  Root `backend`, start `npm start`. Env: `MONGO_URI`, `JWT_SECRET`.
