const FUELS = [
  { id: 'regular',  label: 'Regular'  },
  { id: 'midgrade', label: 'Midgrade' },
  { id: 'premium',  label: 'Premium'  },
  { id: 'diesel',   label: 'Diesel'   },
]

export default function FuelToggle({ activeFuel, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-gray-800 rounded-lg w-fit">
      {FUELS.map(fuel => (
        <button
          key={fuel.id}
          onClick={() => onChange(fuel.id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeFuel === fuel.id
              ? 'bg-amber-500 text-gray-900'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {fuel.label}
        </button>
      ))}
    </div>
  )
}
