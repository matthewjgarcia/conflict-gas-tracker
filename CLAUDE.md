# conflict-gas-tracker — CLAUDE.md

Project context and instructions for Claude Code. Read this at the start of every session before making any changes.

---

## What this project is

An interactive React web app visualizing the impact of the Israel/US–Iran conflict on US gas prices. Users can explore a choropleth map of all 50 states, click a state to see its price breakdown, and view a national price timeline with annotated geopolitical events.

Built to be publicly shared — deployed on GitHub Pages and tweeted out as a data journalism piece.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Map | `react-simple-maps` (GeoJSON choropleth) |
| Charts | `recharts` |
| Styling | Tailwind CSS |
| Data | EIA API (live) + static fallback |
| Deploy | GitHub Pages via `gh-pages` |

---

## File structure

```
conflict-gas-tracker/
├── public/
├── src/
│   ├── components/
│   │   ├── MapPanel.jsx          # Choropleth US map, handles state click
│   │   ├── StateDetailPanel.jsx  # Right panel: selected state prices + sparkline
│   │   ├── TimelineChart.jsx     # National avg line chart with event markers
│   │   ├── MetricsBar.jsx        # Top summary metrics (nat avg, crude, etc.)
│   │   ├── EventsList.jsx        # Dated geopolitical events list
│   │   └── FuelToggle.jsx        # Regular / Midgrade / Premium / Diesel toggle
│   ├── hooks/
│   │   └── useGasPrices.js       # EIA API fetch logic + fallback + caching
│   ├── data/
│   │   ├── fallbackPrices.js     # Static price data for all 50 states + DC
│   │   └── conflictEvents.js     # Hardcoded event list with dates and descriptions
│   ├── utils/
│   │   └── colorScale.js         # Price → hex color mapping for map choropleth
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── CLAUDE.md                     # This file
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Environment variables

```
VITE_EIA_API_KEY=your_key_here
```

- Never hardcode the API key anywhere in source files
- The app must work without the key using fallback data
- `.env.example` documents required vars — keep it updated when adding new ones
- Get a free EIA API key at: https://www.eia.gov/opendata/register.php

---

## EIA API reference

- Base URL: `https://api.eia.gov/v2/`
- Weekly state gas prices: `/petroleum/pri/gnd/data/`
- Key params: `frequency=weekly`, `data[]=value`, `facets[product][]=EPM0` (regular), `facets[duoarea][]=S` + state code (e.g. `SCA` for California)
- Product codes: `EPM0` = regular, `EPM1` = midgrade, `EPM2` = premium, `EPD2D` = diesel
- Always include `?api_key=${import.meta.env.VITE_EIA_API_KEY}` in the query string
- EIA rate limits: 1000 requests/hour — batch state calls or use the national series where possible

---

## Data flow

```
useGasPrices.js
  → checks for VITE_EIA_API_KEY
  → if present: fetches EIA API, parses response, stores in state
  → if missing or fetch fails: loads fallbackPrices.js
  → returns { prices, loading, error, lastUpdated }

App.jsx
  → passes prices down to MapPanel, StateDetailPanel, MetricsBar
  → holds selectedState in top-level state
  → passes setSelectedState to MapPanel
```

---

## Design decisions

- **Color scale**: Yellow (#fef3c7) at $3.40 → dark amber (#92400e) at $5.20+. Uses 7-stop linear interpolation. Logic lives in `utils/colorScale.js`.
- **Fallback first**: App renders immediately with fallback data. EIA data replaces it on load if available. No blank states.
- **State selection**: Clicking a state updates `selectedState` in App.jsx. `StateDetailPanel` reads this and shows the breakdown.
- **Fuel toggle**: Lives in App.jsx state as `activeFuel`. Passed down to MapPanel (re-colors map) and StateDetailPanel (shows correct price).
- **Conflict events**: Hardcoded in `data/conflictEvents.js`. Not fetched from any API — update manually as news develops.

---

## Deployment

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

The `deploy` script in `package.json` runs `vite build && gh-pages -d dist`.

`vite.config.js` has `base: '/conflict-gas-tracker/'` — this must match the GitHub repo name exactly. If the repo name changes, update `base` here.

After deploying, the app is live at:
`https://<your-github-username>.github.io/conflict-gas-tracker/`

---

## Roadmap / planned features

Track what's been built and what's next. Update this section at the end of each session.

### Completed (v1)
- [ ] Choropleth US map with state click
- [ ] State detail side panel (all 4 fuel types)
- [ ] Fuel type toggle
- [ ] National price timeline chart
- [ ] Conflict events list
- [ ] Top metrics bar
- [ ] EIA API integration with fallback
- [ ] GitHub Pages deploy setup

### Planned
- [ ] Crude oil price correlation chart (Brent crude vs national avg overlay)
- [ ] "Compare two states" mode — click a second state to overlay sparklines
- [ ] Mobile responsive layout (current layout is desktop-first)
- [ ] State search/filter input for quick navigation
- [ ] Share button that generates a URL with the selected state in query params (e.g. `?state=CA`)
- [ ] Auto-refresh EIA data every 24 hours (EIA updates weekly, so no need for more frequent)
- [ ] Historical view slider — scrub back to any week since Jan 2025
- [ ] Export to PNG button for the map (for social sharing)

---

## Session notes

Use this section to leave notes for the next session. Clear old notes when they're no longer relevant.

_No notes yet — add them here at the end of each Claude Code session._

---

## Common commands

```bash
npm run dev          # local dev server at localhost:5173
npm run build        # production build to /dist
npm run preview      # preview the production build locally
npm run deploy       # build + push to gh-pages branch
```

---

## Things to never do

- Never hardcode `VITE_EIA_API_KEY` in any source file
- Never remove the fallback data path — the app must always render without an API key
- Never change `base` in `vite.config.js` without also updating the GitHub repo name
- Never install a different map library without updating MapPanel.jsx and removing `react-simple-maps`
- Never store price data in localStorage — always fetch fresh or use in-memory fallback
