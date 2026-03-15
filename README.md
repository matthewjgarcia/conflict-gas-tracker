# Conflict Gas Tracker

An interactive React web app visualizing the impact of the Israel/US–Iran conflict on US gas prices. Explore a choropleth map of all 50 states, click any state to see its price breakdown, and view a national price timeline annotated with key geopolitical events.

Built as a data journalism piece — deployed on GitHub Pages.

---

## Features

- **Choropleth US map** — color-coded by gas price, click any state for details
- **State detail panel** — shows all 4 fuel types (Regular, Midgrade, Premium, Diesel) with a price sparkline
- **National timeline chart** — line chart of the national average with conflict event markers
- **Top metrics bar** — national average, crude oil price, and other key stats at a glance
- **Fuel type toggle** — switch between Regular / Midgrade / Premium / Diesel to re-color the map
- **Live EIA data** — fetches weekly state prices from the EIA API, falls back to static data if unavailable

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Map | `react-simple-maps` |
| Charts | `recharts` |
| Styling | Tailwind CSS |
| Data | EIA API (live) + static fallback |
| Deploy | GitHub Pages via `gh-pages` |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your API key (optional)

The app works without an API key using built-in fallback data. For live prices:

1. Get a free EIA API key at https://www.eia.gov/opendata/register.php
2. Copy `.env.example` to `.env`
3. Add your key:

```
VITE_EIA_API_KEY=your_key_here
```

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173 in your browser. Press `Ctrl+C` to stop the server.

---

## Commands

```bash
npm run dev       # Start local dev server at localhost:5173
npm run build     # Production build to /dist
npm run preview   # Preview the production build locally
npm run deploy    # Build and push to GitHub Pages
```

---

## Deployment

This app deploys to GitHub Pages:

```bash
npm run deploy
```

After deploying, the app is live at:
```
https://<your-github-username>.github.io/conflict-gas-tracker/
```

> **Note:** `vite.config.js` has `base: '/conflict-gas-tracker/'` — this must match your GitHub repo name exactly.

---

## Data Sources

- **Gas prices**: [U.S. Energy Information Administration (EIA)](https://www.eia.gov/opendata/) — weekly state-level retail gas prices
- **Conflict events**: Manually curated in `src/data/conflictEvents.js`

---

## Project Structure

```
src/
├── components/
│   ├── MapPanel.jsx          # Choropleth US map
│   ├── StateDetailPanel.jsx  # Selected state price breakdown
│   ├── TimelineChart.jsx     # National avg chart with event markers
│   ├── MetricsBar.jsx        # Top summary metrics
│   ├── EventsList.jsx        # Geopolitical events list
│   └── FuelToggle.jsx        # Fuel type selector
├── hooks/
│   └── useGasPrices.js       # EIA API fetch + fallback logic
├── data/
│   ├── fallbackPrices.js     # Static prices for all 50 states + DC
│   └── conflictEvents.js     # Conflict event timeline
└── utils/
    └── colorScale.js         # Price → color mapping for the map
```
