import { conflictEvents } from '../data/conflictEvents'

const SEV = {
  critical: { dot: '#ef4444', border: 'border-red-800/40',    bg: 'bg-red-950/30',    text: 'text-red-400'    },
  high:     { dot: '#f97316', border: 'border-orange-800/40', bg: 'bg-orange-950/20', text: 'text-orange-400' },
  medium:   { dot: '#eab308', border: 'border-yellow-800/30', bg: 'bg-yellow-950/10', text: 'text-yellow-400' },
  low:      { dot: '#6b7280', border: 'border-gray-700/40',   bg: 'bg-gray-800/30',   text: 'text-gray-400'   },
}

function fmt(str) {
  return new Date(str + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function EventsList() {
  const sorted = [...conflictEvents].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
        Key Conflict Events
      </h3>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
        {sorted.map(ev => {
          const s = SEV[ev.severity] ?? SEV.low
          return (
            <div key={ev.date + ev.title} className={`rounded-lg border p-3 ${s.bg} ${s.border}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: s.dot }}
                  />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold leading-snug ${s.text}`}>{ev.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{ev.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500 whitespace-nowrap">{fmt(ev.date)}</p>
                  <p className={`text-xs font-bold mt-0.5 tabular-nums ${ev.impact.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                    {ev.impact}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
