import { useState } from 'react'
import { useGasPrices } from './hooks/useGasPrices'
import MetricsBar        from './components/MetricsBar'
import MapPanel          from './components/MapPanel'
import FuelToggle        from './components/FuelToggle'
import StateDetailPanel  from './components/StateDetailPanel'
import TimelineChart     from './components/TimelineChart'
import EventsList        from './components/EventsList'

export default function App() {
  const [selectedState, setSelectedState] = useState(null)
  const [activeFuel, setActiveFuel]       = useState('regular')

  const {
    prices, history, stateHistories,
    loading, usingFallback, fetchStateHistory,
  } = useGasPrices()

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            US Gas Price Tracker
          </h1>
          <p className="text-xs text-gray-500">
            Impact of the Israel/US–Iran Conflict · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-amber-400 animate-pulse">Fetching live data…</span>
          )}
          {usingFallback && !loading && (
            <span className="text-xs text-gray-600 bg-gray-800/60 border border-gray-700 px-2 py-0.5 rounded">
              Estimated data — set VITE_EIA_API_KEY for live prices
            </span>
          )}
        </div>
      </header>

      {/* ── Metrics bar ────────────────────────────────────────────── */}
      <MetricsBar history={history} />

      {/* ── Main two-column layout ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* Left: map + fuel toggle */}
        <div className="flex-1 lg:flex-[3] flex flex-col gap-3 p-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <FuelToggle activeFuel={activeFuel} onChange={setActiveFuel} />
            {selectedState && (
              <button
                onClick={() => setSelectedState(null)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                ✕ Clear selection
              </button>
            )}
          </div>
          <MapPanel
            prices={prices}
            activeFuel={activeFuel}
            selectedState={selectedState}
            onStateSelect={setSelectedState}
          />
        </div>

        {/* Right: state detail + chart + events */}
        <div className="lg:flex-[2] flex flex-col gap-3 p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-800 lg:max-w-md">
          <StateDetailPanel
            selectedState={selectedState}
            prices={prices}
            stateHistories={stateHistories}
            activeFuel={activeFuel}
            onFetchHistory={fetchStateHistory}
          />
          <TimelineChart history={history} />
          <EventsList />
        </div>

      </div>
    </div>
  )
}
