// Static fallback prices — estimated as of mid-March 2026
// Reflects ~$1.16 national avg increase since Jan 2025 (pre-conflict baseline)
// Updated after Feb 28 war outbreak, Hormuz closure, and Kharg Island strikes

export const STATE_NAMES = {
  AL: 'Alabama',      AK: 'Alaska',         AZ: 'Arizona',      AR: 'Arkansas',
  CA: 'California',   CO: 'Colorado',       CT: 'Connecticut',  DE: 'Delaware',
  DC: 'Washington DC',FL: 'Florida',        GA: 'Georgia',      HI: 'Hawaii',
  ID: 'Idaho',        IL: 'Illinois',       IN: 'Indiana',      IA: 'Iowa',
  KS: 'Kansas',       KY: 'Kentucky',       LA: 'Louisiana',    ME: 'Maine',
  MD: 'Maryland',     MA: 'Massachusetts',  MI: 'Michigan',     MN: 'Minnesota',
  MS: 'Mississippi',  MO: 'Missouri',       MT: 'Montana',      NE: 'Nebraska',
  NV: 'Nevada',       NH: 'New Hampshire',  NJ: 'New Jersey',   NM: 'New Mexico',
  NY: 'New York',     NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma',     OR: 'Oregon',         PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina',SD: 'South Dakota',  TN: 'Tennessee',    TX: 'Texas',
  UT: 'Utah',         VT: 'Vermont',        VA: 'Virginia',     WA: 'Washington',
  WV: 'West Virginia',WI: 'Wisconsin',      WY: 'Wyoming',
}

// Current regular gas prices by state ($/gal), estimated Mar 16, 2026
// War-driven surge: +$0.45 avg vs pre-war levels; CA crossed $5.30, HI above $5.60
const regularPrices = {
  AL: 4.19, AK: 5.23, AZ: 4.36, AR: 4.12, CA: 5.31,
  CO: 4.34, CT: 4.43, DE: 4.29, DC: 4.47, FL: 4.27,
  GA: 4.24, HI: 5.68, ID: 4.27, IL: 4.43, IN: 4.16,
  IA: 4.13, KS: 4.08, KY: 4.14, LA: 4.17, ME: 4.37,
  MD: 4.34, MA: 4.39, MI: 4.34, MN: 4.22, MS: 4.16,
  MO: 4.10, MT: 4.40, NE: 4.10, NV: 4.57, NH: 4.32,
  NJ: 4.37, NM: 4.14, NY: 4.63, NC: 4.23, ND: 4.17,
  OH: 4.21, OK: 4.08, OR: 4.80, PA: 4.32, RI: 4.36,
  SC: 4.22, SD: 4.14, TN: 4.17, TX: 4.09, UT: 4.19,
  VT: 4.34, VA: 4.29, WA: 4.97, WV: 4.21, WI: 4.27,
  WY: 4.23,
}

// Pre-conflict baseline (Jan 6, 2025) — ~$1.16 lower on national avg
const BASELINE_NATIONAL_DELTA = 1.16
export const BASELINE_PRICES = Object.fromEntries(
  Object.entries(regularPrices).map(([k, v]) => [k, parseFloat((v - BASELINE_NATIONAL_DELTA).toFixed(2))])
)

export const fallbackPrices = {
  regular:  regularPrices,
  midgrade: Object.fromEntries(Object.entries(regularPrices).map(([k, v]) => [k, parseFloat((v + 0.22).toFixed(2))])),
  premium:  Object.fromEntries(Object.entries(regularPrices).map(([k, v]) => [k, parseFloat((v + 0.44).toFixed(2))])),
  diesel:   Object.fromEntries(Object.entries(regularPrices).map(([k, v]) => [k, parseFloat((v + 0.17).toFixed(2))])),
}

// ─── National weekly price history (Jan 2025 → Mar 2026) ─────────────────────
// 63 data points at weekly intervals — regular prices with conflict-event spikes

const DATES = [
  '2025-01-06','2025-01-13','2025-01-20','2025-01-27','2025-02-03',
  '2025-02-10','2025-02-17','2025-02-24','2025-03-03','2025-03-10',
  '2025-03-17','2025-03-24','2025-03-31','2025-04-07','2025-04-14',
  '2025-04-21','2025-04-28','2025-05-05','2025-05-12','2025-05-19',
  '2025-05-26','2025-06-02','2025-06-09','2025-06-16','2025-06-23',
  '2025-06-30','2025-07-07','2025-07-14','2025-07-21','2025-07-28',
  '2025-08-04','2025-08-11','2025-08-18','2025-08-25','2025-09-01',
  '2025-09-08','2025-09-15','2025-09-22','2025-09-29','2025-10-06',
  '2025-10-13','2025-10-20','2025-10-27','2025-11-03','2025-11-10',
  '2025-11-17','2025-11-24','2025-12-01','2025-12-08','2025-12-15',
  '2025-12-22','2025-12-29','2026-01-05','2026-01-12','2026-01-19',
  '2026-01-26','2026-02-02','2026-02-09','2026-02-16','2026-02-23',
  '2026-03-02','2026-03-09','2026-03-16',
]

// Regular gas national average ($/gal) per week
const REGULAR_VALS = [
  3.25, 3.24, 3.22, 3.21, 3.20,   // Jan: baseline, slight winter dip
  3.21, 3.22, 3.26, 3.30, 3.34,   // Feb: spring ramp begins
  3.38, 3.42, 3.45, 3.50, 3.54,   // Mar–Apr: tensions escalate
  3.60, 3.65, 3.68, 3.71, 3.73,   // Apr–May: US ultimatum to Iran
  3.74, 3.82, 3.89, 3.85, 3.81,   // Jun: US/Israel airstrikes spike
  3.79, 3.76, 3.78, 3.79, 3.84,   // Jul: slight easing
  3.88, 3.92, 3.95, 3.92, 3.89,   // Aug: Hormuz partial disruption
  3.86, 3.83, 3.87, 3.91, 4.00,   // Sep: ceasefire collapses
  4.08, 4.10, 4.12, 4.09, 4.06,   // Oct–Nov: Hormuz full blockade peak
  4.02, 3.98, 3.97, 3.95, 3.93,   // Nov–Dec: gradual easing
  3.91, 3.95, 3.98, 4.00, 4.02,   // Dec–Jan: new sanctions package
  4.01, 3.99, 3.98, 3.97, 3.96,   // Feb: slow improvement
  4.08, 4.29, 4.41,                 // Mar 2026: war outbreak (Feb 28), Hormuz closure, Kharg strikes
]

export const nationalHistory = DATES.map((date, i) => ({
  date,
  regular:  REGULAR_VALS[i],
  midgrade: parseFloat((REGULAR_VALS[i] + 0.21).toFixed(2)),
  premium:  parseFloat((REGULAR_VALS[i] + 0.43).toFixed(2)),
  diesel:   parseFloat((REGULAR_VALS[i] + 0.19).toFixed(2)),
}))

// ─── Per-state sparkline history ─────────────────────────────────────────────
// Approximate state weekly history for the last 24 weeks.
// Scales the national trend by the state's price ratio, giving a realistic shape.

const NATIONAL_CURRENT = { regular: 4.41, midgrade: 4.62, premium: 4.84, diesel: 4.60 }

export function getStateHistory(stateCode, fuelType = 'regular') {
  const statePrice = fallbackPrices[fuelType]?.[stateCode] ?? NATIONAL_CURRENT[fuelType]
  const ratio = statePrice / NATIONAL_CURRENT[fuelType]
  return nationalHistory.slice(-24).map(point => ({
    date:  point.date,
    value: parseFloat((point[fuelType] * ratio).toFixed(2)),
  }))
}
