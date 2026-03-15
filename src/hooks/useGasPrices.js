import { useState, useEffect, useCallback } from 'react'
import { fallbackPrices, nationalHistory, getStateHistory } from '../data/fallbackPrices'

const EIA_BASE = 'https://api.eia.gov/v2/petroleum/pri/gnd/data/'

// EIA duoarea codes per state (S + 2-letter abbreviation)
const STATE_TO_EIA = {
  AL:'SAL', AK:'SAK', AZ:'SAZ', AR:'SAR', CA:'SCA', CO:'SCO', CT:'SCT', DE:'SDE',
  DC:'SDC', FL:'SFL', GA:'SGA', HI:'SHI', ID:'SID', IL:'SIL', IN:'SIN', IA:'SIA',
  KS:'SKS', KY:'SKY', LA:'SLA', ME:'SME', MD:'SMD', MA:'SMA', MI:'SMI', MN:'SMN',
  MS:'SMS', MO:'SMO', MT:'SMT', NE:'SNE', NV:'SNV', NH:'SNH', NJ:'SNJ', NM:'SNM',
  NY:'SNY', NC:'SNC', ND:'SND', OH:'SOH', OK:'SOK', OR:'SOR', PA:'SPA', RI:'SRI',
  SC:'SSC', SD:'SSD', TN:'STN', TX:'STX', UT:'SUT', VT:'SVT', VA:'SVA', WA:'SWA',
  WV:'SWV', WI:'SWI', WY:'SWY',
}

const EIA_TO_STATE = Object.fromEntries(
  Object.entries(STATE_TO_EIA).map(([state, eia]) => [eia, state])
)

function eiaUrl(duoarea, product, length, apiKey) {
  return (
    `${EIA_BASE}?frequency=weekly&data[]=value` +
    `&facets[product][]=${product}` +
    `&facets[duoarea][]=${duoarea}` +
    `&sort[0][column]=period&sort[0][direction]=desc` +
    `&length=${length}&api_key=${apiKey}`
  )
}

function buildAllStatesUrl(apiKey) {
  const duoareas = Object.values(STATE_TO_EIA).map(c => `&facets[duoarea][]=${c}`).join('')
  return (
    `${EIA_BASE}?frequency=weekly&data[]=value` +
    `&facets[product][]=EPM0` +
    duoareas +
    `&sort[0][column]=period&sort[0][direction]=desc` +
    `&length=51&api_key=${apiKey}`
  )
}

export function useGasPrices() {
  const [prices, setPrices]               = useState(fallbackPrices)
  const [history, setHistory]             = useState(nationalHistory)
  const [stateHistories, setStateHistories] = useState({})
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)
  const [lastUpdated, setLastUpdated]     = useState(null)
  const [usingFallback, setUsingFallback] = useState(true)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_EIA_API_KEY
    if (!apiKey) return // no key → stay on fallback

    const fetchAll = async () => {
      setLoading(true)
      try {
        // 1. Fetch national weekly history for all 4 fuel types
        const [rRes, mRes, pRes, dRes] = await Promise.all([
          fetch(eiaUrl('NUS', 'EPM0',  80, apiKey)),
          fetch(eiaUrl('NUS', 'EPM1',  80, apiKey)),
          fetch(eiaUrl('NUS', 'EPM2',  80, apiKey)),
          fetch(eiaUrl('NUS', 'EPD2D', 80, apiKey)),
        ])
        if (!rRes.ok) throw new Error(`EIA API ${rRes.status}`)

        const [rJson, mJson, pJson, dJson] = await Promise.all([
          rRes.json(), mRes.json(), pRes.json(), dRes.json(),
        ])

        const byDate = {}
        const merge = (json, key) => {
          for (const row of (json.response?.data ?? [])) {
            if (!byDate[row.period]) byDate[row.period] = { date: row.period }
            byDate[row.period][key] = parseFloat(row.value)
          }
        }
        merge(rJson, 'regular')
        merge(mJson, 'midgrade')
        merge(pJson, 'premium')
        merge(dJson, 'diesel')

        const newHistory = Object.values(byDate)
          .sort((a, b) => a.date.localeCompare(b.date))
          .filter(d => d.regular != null)

        if (newHistory.length > 0) {
          setHistory(newHistory)
          setUsingFallback(false)
          setLastUpdated(new Date())
        }

        // 2. Fetch current-week state prices (regular only) for map coloring
        const stateRes = await fetch(buildAllStatesUrl(apiKey))
        if (stateRes.ok) {
          const stateJson = await stateRes.json()
          const newRegular = { ...fallbackPrices.regular }
          for (const row of (stateJson.response?.data ?? [])) {
            const code = EIA_TO_STATE[row.duoarea]
            if (code) newRegular[code] = parseFloat(row.value)
          }
          setPrices({
            regular:  newRegular,
            midgrade: Object.fromEntries(Object.entries(newRegular).map(([k, v]) => [k, parseFloat((v + 0.22).toFixed(2))])),
            premium:  Object.fromEntries(Object.entries(newRegular).map(([k, v]) => [k, parseFloat((v + 0.44).toFixed(2))])),
            diesel:   Object.fromEntries(Object.entries(newRegular).map(([k, v]) => [k, parseFloat((v + 0.17).toFixed(2))])),
          })
        }
      } catch (err) {
        console.warn('EIA API failed, using fallback:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // Fetch per-state weekly history on demand (for sparklines)
  const fetchStateHistory = useCallback(async (stateCode) => {
    if (stateHistories[stateCode]) return // already loaded

    const apiKey = import.meta.env.VITE_EIA_API_KEY
    if (!apiKey) {
      // Compute approximate history from national trend
      setStateHistories(prev => ({
        ...prev,
        [stateCode]: {
          regular:  getStateHistory(stateCode, 'regular'),
          midgrade: getStateHistory(stateCode, 'midgrade'),
          premium:  getStateHistory(stateCode, 'premium'),
          diesel:   getStateHistory(stateCode, 'diesel'),
        },
      }))
      return
    }

    const eiaCode = STATE_TO_EIA[stateCode]
    if (!eiaCode) return

    try {
      const [rJ, mJ, pJ, dJ] = await Promise.all([
        fetch(eiaUrl(eiaCode, 'EPM0',  26, apiKey)).then(r => r.json()),
        fetch(eiaUrl(eiaCode, 'EPM1',  26, apiKey)).then(r => r.json()),
        fetch(eiaUrl(eiaCode, 'EPM2',  26, apiKey)).then(r => r.json()),
        fetch(eiaUrl(eiaCode, 'EPD2D', 26, apiKey)).then(r => r.json()),
      ])
      const parse = (json) =>
        (json.response?.data ?? [])
          .map(row => ({ date: row.period, value: parseFloat(row.value) }))
          .sort((a, b) => a.date.localeCompare(b.date))

      setStateHistories(prev => ({
        ...prev,
        [stateCode]: {
          regular: parse(rJ), midgrade: parse(mJ),
          premium: parse(pJ), diesel:   parse(dJ),
        },
      }))
    } catch {
      // Fall back to computed history
      setStateHistories(prev => ({
        ...prev,
        [stateCode]: {
          regular:  getStateHistory(stateCode, 'regular'),
          midgrade: getStateHistory(stateCode, 'midgrade'),
          premium:  getStateHistory(stateCode, 'premium'),
          diesel:   getStateHistory(stateCode, 'diesel'),
        },
      }))
    }
  }, [stateHistories])

  return { prices, history, stateHistories, loading, error, lastUpdated, usingFallback, fetchStateHistory }
}
