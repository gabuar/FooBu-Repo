import { useEffect, useMemo, useRef, useState } from 'react'
import { MOODS, GENRE_EMOJI } from '../data/seed.js'
import { Stars } from './ui.jsx'
import { peso } from '../lib/format.js'
import { publishedStalls, ratingOf, useStore } from '../lib/store.js'

const COLORS = ['#f6a58f', '#f8cf72', '#a7d6b8', '#f4b78e', '#fbe2a6', '#ee9b82', '#98cdb0', '#f9d392']
const R = 150
const pt = (deg, r) => { const a = (deg * Math.PI) / 180; return [r * Math.sin(a), -r * Math.cos(a)] }
const slicePath = (a0, a1) => {
  const [x0, y0] = pt(a0, R)
  const [x1, y1] = pt(a1, R)
  return `M0 0 L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`
}
const short = (name) => {
  let out = ''
  for (const w of name.split(' ')) { if ((out + ' ' + w).trim().length > 14) break; out = (out + ' ' + w).trim() }
  return out || name.slice(0, 14)
}

export default function SpinWheel() {
  const s = useStore()
  const [mood, setMood] = useState('all')
  const [cheap, setCheap] = useState(false)
  const [rot, setRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [history, setHistory] = useState([])
  const next = useRef(null)
  const timer = useRef(null)

  const pool = useMemo(() => {
    const genres = MOODS.find((m) => m.id === mood).genres
    return publishedStalls(s).filter((x) => genres.includes(x.genre) && (!cheap || x.tier === 1))
  }, [s.stalls, mood, cheap]) // eslint-disable-line react-hooks/exhaustive-deps
  const n = pool.length
  const a = 360 / Math.max(n, 1)

  useEffect(() => { setWinner(null) }, [mood, cheap])
  useEffect(() => () => clearTimeout(timer.current), [])

  const spin = () => {
    if (spinning || n < 3) return
    const w = Math.floor(Math.random() * n)
    const jitter = (Math.random() - 0.5) * a * 0.6
    setWinner(null)
    setSpinning(true)
    next.current = pool[w]
    setRot(Math.ceil(rot / 360) * 360 + 360 * 5 - (w + 0.5) * a + jitter)
    timer.current = setTimeout(() => {
      setSpinning(false)
      setWinner(next.current)
      setHistory((h) => [next.current, ...h].slice(0, 5))
    }, 4300)
  }

  const { avg, count } = winner ? ratingOf(s, winner.id) : { avg: 0, count: 0 }

  return (
    <div className="spin-card panel">
      <div className="wheel-stage">
        <div className="wheel">
          <span className="wheel-pin" aria-hidden="true" />
          <div className="wheel-spin" style={{ transform: `rotate(${rot}deg)` }}>
            <svg viewBox="-160 -160 320 320" role="img" aria-label="Wheel of food stalls">
              <circle r={R + 6} fill="#2a2119" />
              {n >= 3 && pool.map((st, i) => (
                <g key={st.id}>
                  <path d={slicePath(i * a, (i + 1) * a)} fill={COLORS[i % COLORS.length]} stroke="#2a2119" strokeWidth="2" />
                  <text transform={`rotate(${i * a + a / 2 - 90})`} x="44" y="5" className="wheel-label">{short(st.name)}</text>
                </g>
              ))}
            </svg>
          </div>
          <button className="wheel-hub" onClick={spin} disabled={spinning || n < 3} aria-label="Spin">{spinning ? '…' : 'SPIN'}</button>
        </div>
      </div>

      <div className="spin-controls">
        <h2>What are you in the mood for?</h2>
        <div className="chips">
          {MOODS.map((m) => (
            <button key={m.id} className={'chip' + (mood === m.id ? ' on' : '')} onClick={() => setMood(m.id)} disabled={spinning}>{m.label}</button>
          ))}
          <button className={'chip' + (cheap ? ' on' : '')} onClick={() => setCheap(!cheap)} disabled={spinning}>Budget ₱ only</button>
        </div>
        <p className="muted small">{n} {n === 1 ? 'stall' : 'stalls'} on the plate.{n < 3 && ' Loosen a filter to spin.'}</p>
        <button className="primary spin-go" onClick={spin} disabled={spinning || n < 3}>{spinning ? 'Spinning…' : 'Spin the plate'}</button>

        {winner && (
          <div className="winner" key={winner.id + rot}>
            <span className="winner-emoji">{GENRE_EMOJI[winner.genre]}</span>
            <div>
              <b>{winner.name}</b>
              <div className="muted small">{winner.genre} · {peso(winner.tier)} · {winner.area}</div>
              <Stars value={avg} count={count} size={14} />
            </div>
            <a className="btn primary" href={'#/stall/' + winner.id}>See the stall</a>
          </div>
        )}

        {history.length > 1 && (
          <div className="history">
            <span className="muted small">Earlier spins</span>
            <div className="chips">{history.slice(1).map((h, i) => <a key={i} className="chip static" href={'#/stall/' + h.id}>{h.name}</a>)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
