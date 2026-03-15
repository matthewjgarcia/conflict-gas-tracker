import { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { STATE_NAMES, BASELINE_PRICES } from '../data/fallbackPrices'

const FUEL_CONFIG = {
  regular:  { label: 'Regular',  color: '#f59e0b' },
  midgrade: { label: 'Midgrade', color: '#fb923c' },
  premium:  { label: 'Premium',  color: '#a78bfa' },
  diesel:   { label: 'Diesel',   color: '#34d399' },
}

export default function StateDetailPanel({ selectedState, prices, stateHistories, activeFuel, onFetchHistory }) {
  useEffect(() => {
    if (selectedState) onFetchHistory(selectedState)
  }, [selectedState, onFetchHistory])

  if (!selectedState) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 bg-gray-900 rounded-xl border border-gray-800 text-gray-600">
        <svg className="w-9 h-9 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-sm">Click any state to see prices</p>
      </div>
    )
  }

  const stateName    = STATE_NAMES[selectedState] ?? selectedState
  const currentPrice = prices.regular?.[selectedState] ?? 0
  const baseline     = BASELINE_PRICES[selectedState] ?? 0
  const delta        = currentPrice - baseline
  const sparkData    = stateHistories[selectedState]?.[activeFuel] ?? []

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      {/* State header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{stateName}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Current pump prices</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-400 tabular-nums">${currentPrice.toFixed(2)}</p>
          <p className={`text-xs font-semibold tabular-nums ${delta >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {delta >= 0 ? '+' : ''}${delta.toFixed(2)} vs Jan 2025
          </p>
        </div>
      </div>

      {/* Fuel type grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(FUEL_CONFIG).map(([fuel, cfg]) => (
          <div
            key={fuel}
            className={`rounded-lg p-3 transition-colors ${
              activeFuel === fuel ? 'bg-gray-700 ring-1 ring-amber-500/60' : 'bg-gray-800'
            }`}
          >
            <p className="text-xs text-gray-500 mb-1">{cfg.label}</p>
            <p className="text-lg font-semibold tabular-nums" style={{ color: cfg.color }}>
              ${(prices[fuel]?.[selectedState] ?? 0).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          {FUEL_CONFIG[activeFuel]?.label} — 6-month trend
        </p>
        {sparkData.length > 0 ? (
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={sparkData} margin={{ top: 2, right: 4, bottom: 2, left: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.[0] ? (
                    <div className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs shadow-lg">
                      <p className="text-gray-400">{payload[0].payload.date}</p>
                      <p className="font-bold tabular-nums" style={{ color: FUEL_CONFIG[activeFuel]?.color }}>
                        ${payload[0].value.toFixed(2)}
                      </p>
                    </div>
                  ) : null
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={FUEL_CONFIG[activeFuel]?.color ?? '#f59e0b'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-20 flex items-center justify-center text-gray-600 text-xs">
            Loading…
          </div>
        )}
      </div>
    </div>
  )
}
