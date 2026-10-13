import { GENRE_EMOJI } from '../data/seed.js'
import { Stars } from './ui.jsx'
import { peso } from '../lib/format.js'
import { act, me, ratingOf, useStore } from '../lib/store.js'
import { tryDo } from '../lib/toast.js'

export default function StallCard({ stall, active, onSelect, compact }) {
  const s = useStore()
  const user = me(s)
  const { avg, count } = ratingOf(s, stall.id)
  const fav = !!user && (s.favorites[user.id] || []).includes(stall.id)

  const heart = (e) => {
    e.stopPropagation()
    tryDo(() => act.toggleFav(stall.id), fav ? undefined : 'Saved to your favorites.')
  }

  return (
    <article className={'stall-card' + (active ? ' active' : '') + (compact ? ' compact' : '')} onClick={() => onSelect && onSelect(stall.id)}>
      <div className="tile" aria-hidden="true">{GENRE_EMOJI[stall.genre]}</div>
      <div className="sc-main">
        <div className="between">
          <h3><a href={'#/stall/' + stall.id} onClick={(e) => e.stopPropagation()}>{stall.name}</a></h3>
          {!compact && (
            <button className={'heart' + (fav ? ' on' : '')} onClick={heart} aria-label={fav ? 'Remove from favorites' : 'Save to favorites'} aria-pressed={fav}>♥</button>
          )}
        </div>
        <div className="meta-row">
          <span className="cat">{stall.genre}</span>
          <span className="tier" title="Price range">{peso(stall.tier)}</span>
          <span className="muted small">{stall.area}</span>
        </div>
        <Stars value={avg} count={count} size={14} />
        {!compact && <p className="muted small clamp">{stall.address}</p>}
      </div>
    </article>
  )
}
