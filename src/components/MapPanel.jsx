import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { priceToColor, LEGEND_STOPS } from '../utils/colorScale'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// FIPS numeric code → state abbreviation
const FIPS_TO_STATE = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT','10':'DE',
  '11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN','19':'IA',
  '20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA','26':'MI','27':'MN',
  '28':'MS','29':'MO','30':'MT','31':'NE','32':'NV','33':'NH','34':'NJ','35':'NM',
  '36':'NY','37':'NC','38':'ND','39':'OH','40':'OK','41':'OR','42':'PA','44':'RI',
  '45':'SC','46':'SD','47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA',
  '54':'WV','55':'WI','56':'WY',
}

export default function MapPanel({ prices, activeFuel, selectedState, onStateSelect }) {
  return (
    <div>
      <ComposableMap
        projection="geoAlbersUsa"
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const fips      = String(geo.id).padStart(2, '0')
              const stateCode = FIPS_TO_STATE[fips]
              const price     = prices[activeFuel]?.[stateCode]
              const isSelected = stateCode === selectedState

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => stateCode && onStateSelect(stateCode)}
                  title={stateCode ? `${stateCode}: $${price?.toFixed(2) ?? '—'}` : ''}
                  style={{
                    default: {
                      fill: priceToColor(price),
                      stroke: isSelected ? '#ffffff' : '#111827',
                      strokeWidth: isSelected ? 2 : 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: priceToColor(price),
                      stroke: '#f59e0b',
                      strokeWidth: 1.5,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: priceToColor(price),
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      outline: 'none',
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Color scale legend */}
      <div className="flex items-center gap-2 mt-1 px-1">
        <span className="text-xs text-gray-500 tabular-nums">${LEGEND_STOPS[0].price.toFixed(2)}</span>
        <div
          className="flex-1 h-2.5 rounded-sm"
          style={{ background: 'linear-gradient(to right, #fef3c7, #fde68a, #fbbf24, #f59e0b, #d97706, #b45309, #92400e)' }}
        />
        <span className="text-xs text-gray-500 tabular-nums">${LEGEND_STOPS[LEGEND_STOPS.length - 1].price.toFixed(2)}+</span>
      </div>
    </div>
  )
}
