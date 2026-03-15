// Geopolitical events driving gas price movements
// severity: 'critical' | 'high' | 'medium' | 'low'

export const conflictEvents = [
  {
    date: '2025-01-15',
    title: 'Iran Enriches Uranium to 90%',
    description: 'IAEA confirms Iran has enriched uranium to weapons-grade level at Fordow facility.',
    impact: '+$0.04',
    severity: 'low',
  },
  {
    date: '2025-04-07',
    title: 'US Issues Ultimatum to Iran',
    description: 'White House demands Iran freeze nuclear program within 30 days or face maximum pressure.',
    impact: '+$0.09',
    severity: 'medium',
  },
  {
    date: '2025-04-21',
    title: 'Israel Strikes Iranian Proxy Bases',
    description: 'Israeli Air Force hits Hezbollah supply lines in Syria and Lebanon in coordinated strikes.',
    impact: '+$0.11',
    severity: 'medium',
  },
  {
    date: '2025-05-12',
    title: 'Iran Threatens Hormuz Closure',
    description: 'IRGC commander warns Strait of Hormuz could be mined if US military action proceeds.',
    impact: '+$0.06',
    severity: 'medium',
  },
  {
    date: '2025-06-09',
    title: 'US & Israel Strike Iran Nuclear Sites',
    description: 'Joint airstrikes destroy Natanz and Fordow nuclear facilities. Iran vows retaliation.',
    impact: '+$0.15',
    severity: 'high',
  },
  {
    date: '2025-06-17',
    title: 'Iran Retaliates — Missile Barrage',
    description: 'Iran fires 120+ ballistic missiles toward US bases in Qatar and Saudi Arabia. Most intercepted.',
    impact: '+$0.04',
    severity: 'high',
  },
  {
    date: '2025-08-04',
    title: 'Hormuz Partial Disruption Begins',
    description: 'IRGC navy deploys mines near Hormuz shipping lanes. Major tankers rerouted around Cape of Good Hope.',
    impact: '+$0.09',
    severity: 'high',
  },
  {
    date: '2025-09-29',
    title: 'UN-Brokered Ceasefire Collapses',
    description: '45-day ceasefire falls apart after Iranian drone attack on USS Gerald Ford.',
    impact: '+$0.08',
    severity: 'high',
  },
  {
    date: '2025-10-13',
    title: 'Hormuz Full Blockade — Oil Spikes',
    description: 'Iran announces full closure of Hormuz to enemy-flagged vessels. Brent crude surges past $98/bbl.',
    impact: '+$0.17',
    severity: 'critical',
  },
  {
    date: '2025-11-08',
    title: 'US Navy Reopens Hormuz Corridor',
    description: '5th Fleet escorts clear passage through strait after 26-day de facto blockade. Prices ease.',
    impact: '-$0.06',
    severity: 'medium',
  },
  {
    date: '2026-01-05',
    title: 'New Iran Sanctions Package',
    description: 'G7 + EU impose sweeping new oil sanctions on Iran, including secondary sanctions on buyers.',
    impact: '+$0.07',
    severity: 'medium',
  },
  {
    date: '2026-02-22',
    title: 'Ceasefire Negotiations Resume',
    description: 'Qatar-mediated talks in Doha show first signs of progress. Brent crude dips below $85/bbl.',
    impact: '-$0.03',
    severity: 'low',
  },
]
