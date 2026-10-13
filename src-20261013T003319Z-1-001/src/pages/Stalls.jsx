import { useEffect, useMemo, useState } from 'react'
import { GENRES } from '../data/seed.js'
import { mapsLink } from '../lib/format.js'
import { publishedStalls, ratingOf, useStore } from '../lib/store.js'
import StallCard from '../components/StallCard.jsx'
import GoogleMap from '../components/GoogleMap.jsx'

export default function Stalls({ route }) {
  const s = useStore()
  const urlQ = route.params[0] === 'q' ? route.params[1] || '' : ''
  const [q, setQ] = useState(urlQ)
  const [genre, setGenre] = useState('')
  const [tier, setTier] = useState(0)
  const [minRating, setMinRating] = useState(0)
  const [sort, setSort] = useState('top')
  const [active, setActive] = useState(null)

  useEffect(() => { setQ(urlQ) }, [urlQ])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return publishedStalls(s)
      .map((st) => ({ st, ...ratingOf(s, st.id) }))
      .filter(({ st, avg }) =>
        (!genre || st.genre === genre) && (!tier || st.tier === tier) && avg >= minRating &&
        (!needle || [st.name, st.genre, st.area, st.address, ...st.dishes].join(' ').toLowerCase().includes(needle)))
      .sort((a, b) => sort === 'name' ? a.st.name.localeCompare(b.st.name)
        : sort === 'reviews' ? b.count - a.count : b.avg - a.avg || b.count - a.count)
      .map((x) => x.st)
  }, [s, q, genre, tier, minRating, sort])

  const activeStall = shown.find((x) => x.id === active) || null
  const clear = () => { setQ(''); setGenre(''); setTier(0); setMinRating(0) }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Stalls & map</h1>
        <p className="muted">Filter by genre, price and rating, then tap a stall to see it on Google Maps.</p>
      </div>

      <div className="filters panel">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, dish or street" aria-label="Search stalls" />
        <div className="chips">
          <button className={'chip' + (!genre ? ' on' : '')} onClick={() => setGenre('')}>All genres</button>
          {GENRES.map((g) => <button key={g} className={'chip' + (genre === g ? ' on' : '')} onClick={() => setGenre(genre === g ? '' : g)}>{g}</button>)}
        </div>
        <div className="row wrap-row">
          <label className="inline">Price
            <select value={tier} onChange={(e) => setTier(+e.target.value)}>
              <option value={0}>Any</option><option value={1}>₱ budget</option><option value={2}>₱₱ mid</option>
            </select>
          </label>
          <label className="inline">Minimum rating: {minRating ? minRating.toFixed(1) + '★' : 'any'}
            <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(+e.target.value)} />
          </label>
          <label className="inline">Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="top">Top rated</option><option value="reviews">Most reviewed</option><option value="name">Name</option>
            </select>
          </label>
          <button className="ghost" onClick={clear}>Clear filters</button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="panel empty">
          <b>No stalls match</b>
          <p className="muted">Loosen a filter, or post a <a href="#/">Suggested place</a> in the feed for a stall we are missing.</p>
        </div>
      ) : (
        <div className="stalls-grid">
          <div className="stack">
            <p className="muted small">{shown.length} {shown.length === 1 ? 'stall' : 'stalls'}</p>
            {shown.map((st) => <StallCard key={st.id} stall={st} active={active === st.id} onSelect={setActive} />)}
          </div>
          <div className="map-col">
            <GoogleMap stall={activeStall} height={520} />
            <p className="muted small">
              {activeStall
                ? <>Showing {activeStall.name}. <a href={mapsLink(activeStall)} target="_blank" rel="noreferrer">Open in Google Maps</a></>
                : 'Showing food stalls near UST. Tap a stall to jump to it.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
