# WanderList — Capstone Proposal

## 1. Project Idea

WanderList is a full-stack web application that helps travelers organize their bucket list and log countries they've already visited. Users search countries using the REST Countries API, save destinations to a "want to visit" list, and mark places as visited with personal notes and travel dates — all in one place instead of scattered across Notes apps, Instagram saves, and group chats.

## 2. Features

- **Country search** — search countries by name using the REST Countries API; results show flag, name, region, capital, and population
- **Country detail view** — click a country to see full info (languages, currencies, timezones, borders, map link)
- **Wishlist management** — add any country to a personal "want to visit" list
- **Mark as visited** — move a country from "Want to Visit" to "Visited" with travel date and personal notes
- **Edit travel notes** — update notes and visit date for any visited country
- **Remove destinations** — delete countries from either list
- **User authentication** — sign in with Google so each user sees only their own lists
- **Persistent storage** — all destinations and notes are saved to a MongoDB database

**Stretch goals** (will attempt if core features finish ahead of schedule):

- **Filter and sort** — view destinations by region, by date visited, or alphabetically
- **Travel stats** — simple dashboard showing total countries visited, regions covered, and wishlist count

## 3. Target Audience

Casual travelers and travel enthusiasts who want a simple, personal way to track where they want to go and where they've already been. No social feed, no algorithm, no influencer-style trip planning — just a clean private log of destinations with notes and dates. Primarily aimed at users in their 20s and 30s who already use phone notes or screenshots to remember travel ideas and want something purpose-built instead.

## 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| External API | REST Countries v3.1 |
| Authentication | Google OAuth 2.0 via Passport.js + express-session + connect-mongo |
| Deployment | Render (frontend static site + backend web service) |

**Scope:** this project will not include social features (sharing, comments, following), photo uploads, an interactive map view, or a mobile app. The app will be responsive and work on both desktop and mobile browsers.

## 5. Cost Estimate

### Free Tier — portfolio / personal project

| Service | Plan | Monthly Cost |
|---|---|---|
| Render (frontend static site) | Free | $0 |
| Render (backend web service) | Free | $0 |
| MongoDB Atlas | M0 Free | $0 |
| REST Countries API | Free | $0 |
| Google OAuth | Free | $0 |
| Domain name | None | $0 |
| **Total** | | **$0/month** |

### Paid — small production app

| Service | Plan | Monthly Cost |
|---|---|---|
| Render (frontend static site) | Free | $0 |
| Render (backend web service) | Starter | $7 |
| MongoDB Atlas | Flex | $8–$30 |
| REST Countries API | Free | $0 |
| Google OAuth | Free | $0 |
| Domain name | `.com` via Namecheap | ~$1 |
| **Total** | | **~$16–$38/month** |

### Scaling — 10,000 active users

| Service | Concern at scale | Upgrade needed |
|---|---|---|
| Render backend | CPU/memory limits hit under concurrent load | Standard plan (~$25/month) or horizontal scaling |
| MongoDB Atlas | Storage and connection limits grow | M20 ($130/month) or M30 ($190/month) cluster |
| **Estimated total at scale** | | **~$155–$215/month** |
