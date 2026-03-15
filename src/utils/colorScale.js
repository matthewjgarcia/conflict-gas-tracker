// Yellow (#fef3c7) at $3.40 → dark amber (#92400e) at $5.20+
// 7-stop linear interpolation

const STOPS = [
  { price: 3.40, r: 254, g: 243, b: 199 }, // #fef3c7
  { price: 3.67, r: 253, g: 230, b: 138 }, // #fde68a
  { price: 3.93, r: 251, g: 191, b:  36 }, // #fbbf24
  { price: 4.20, r: 245, g: 158, b:  11 }, // #f59e0b
  { price: 4.47, r: 217, g: 119, b:   6 }, // #d97706
  { price: 4.73, r: 180, g:  83, b:   9 }, // #b45309
  { price: 5.20, r: 146, g:  64, b:  14 }, // #92400e
]

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t)
}

export function priceToColor(price) {
  if (price == null || isNaN(price)) return '#374151' // gray-700 for no data

  if (price <= STOPS[0].price) {
    const s = STOPS[0]
    return `rgb(${s.r},${s.g},${s.b})`
  }
  if (price >= STOPS[STOPS.length - 1].price) {
    const s = STOPS[STOPS.length - 1]
    return `rgb(${s.r},${s.g},${s.b})`
  }
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (price >= STOPS[i].price && price <= STOPS[i + 1].price) {
      const t = (price - STOPS[i].price) / (STOPS[i + 1].price - STOPS[i].price)
      return `rgb(${lerp(STOPS[i].r, STOPS[i+1].r, t)},${lerp(STOPS[i].g, STOPS[i+1].g, t)},${lerp(STOPS[i].b, STOPS[i+1].b, t)})`
    }
  }
  return '#374151'
}

// Exported for the legend
export const LEGEND_STOPS = STOPS
