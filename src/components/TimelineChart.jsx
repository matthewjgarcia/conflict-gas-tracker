import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { conflictEvents } from '../data/conflictEvents'

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#6b7280',
}

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.[0]) return null
  const event = conflictEvents.find(e => e.date === label)
  return (
    <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs shadow-xl max-w-56">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-amber-400 font-bold tabular-nums">${payload[0].value?.toFixed(2)}/gal</p>
      {event && (
        <p className="text-gray-300 mt-1 leading-snug">{event.title}</p>
      )}
    </div>
  )
}

export default function TimelineChart({ history }) {
  if (!history?.length) return null

  const rangeStart = history[0].date
  const rangeEnd   = history[history.length - 1].date

  const visibleEvents = conflictEvents.filter(
    e => e.date >= rangeStart && e.date <= rangeEnd
  )

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        National Average — Regular Gas
      </h3>
      <p className="text-xs text-gray-600 mb-3">Jan 2025 to present · dashed lines = key events</p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: '#6b7280' }}
            tickFormatter={(val, i) => i % 8 === 0 ? formatDate(val) : ''}
            interval={0}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 9, fill: '#6b7280' }}
            tickFormatter={v => `$${v.toFixed(2)}`}
            width={46}
          />
          <Tooltip content={<CustomTooltip />} />

          {visibleEvents.map(ev => (
            <ReferenceLine
              key={ev.date + ev.title}
              x={ev.date}
              stroke={SEVERITY_COLORS[ev.severity] ?? '#6b7280'}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          ))}

          <Line
            type="monotone"
            dataKey="regular"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Severity legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
          <div key={sev} className="flex items-center gap-1.5">
            <svg width="14" height="8">
              <line x1="0" y1="4" x2="14" y2="4" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <span className="text-xs text-gray-500 capitalize">{sev}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
