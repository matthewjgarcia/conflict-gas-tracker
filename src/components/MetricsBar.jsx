const BRENT_CRUDE    = 89.40
const BRENT_CHANGE   = '+28%'
const BASELINE_PRICE = 3.25  // national avg regular, Jan 6 2025

export default function MetricsBar({ history }) {
  const latest = history?.[history.length - 1]
  const nationalAvg = latest?.regular ?? 3.96
  const delta       = nationalAvg - BASELINE_PRICE
  const deltaPct    = ((delta / BASELINE_PRICE) * 100).toFixed(1)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800 border-b border-gray-800">
      <Metric
        label="National Avg (Regular)"
        value={`$${nationalAvg.toFixed(2)}`}
        sub={`+$${delta.toFixed(2)} (+${deltaPct}%) vs Jan 2025`}
        valueClass="text-amber-400"
      />
      <Metric
        label="Pre-Conflict Baseline"
        value={`$${BASELINE_PRICE.toFixed(2)}`}
        sub="Week of Jan 6, 2025"
        valueClass="text-gray-300"
      />
      <Metric
        label="Brent Crude"
        value={`$${BRENT_CRUDE}/bbl`}
        sub={`${BRENT_CHANGE} since Jan 2025`}
        valueClass="text-red-400"
      />
      <div className="bg-gray-900 px-4 py-3 flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Strait of Hormuz</span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
          <span className="text-lg font-bold text-yellow-400 leading-none">MONITORED</span>
        </div>
        <span className="text-xs text-gray-500">US Navy escorts active</span>
      </div>
    </div>
  )
}

function Metric({ label, value, sub, valueClass }) {
  return (
    <div className="bg-gray-900 px-4 py-3 flex flex-col gap-1">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold leading-none mt-0.5 ${valueClass}`}>{value}</span>
      <span className="text-xs text-gray-400 mt-0.5">{sub}</span>
    </div>
  )
}
