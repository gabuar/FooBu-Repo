import { useState } from 'react'
import { GENRE_EMOJI } from '../data/seed.js'
import { directions, peso } from '../lib/format.js'
import { act, me, ratingOf, reviewsOf, useStore } from '../lib/store.js'
import { tryDo } from '../lib/toast.js'
import { Badge, Empty, Stars } from '../components/ui.jsx'
import GoogleMap from '../components/GoogleMap.jsx'
import PostCard from '../components/PostCard.jsx'
import Composer from '../components/Composer.jsx'

export default function Stall({ id }) {
  const s = useStore()
  const user = me(s)
  const [writing, setWriting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ hours: '', desc: '' })
  const [claiming, setClaiming] = useState(false)
  const [note, setNote] = useState('')

  const stall = s.stalls.find((x) => x.id === id && x.status === 'published')
  if (!stall) return <Empty title="Stall not found">It may have been removed. <a href="#/stalls">Back to all stalls</a>.</Empty>

  // Blog reviews first (newest first), then other posts that mention the stall.
  const posts = s.posts.filter((p) => p.stallId === id).sort((a, b) => (b.rating ? 1 : 0) - (a.rating ? 1 : 0) || b.createdAt - a.createdAt)
  const rated = reviewsOf(s, id)
  const { avg, count } = ratingOf(s, id)
  const owner = stall.ownerId && s.users.find((u) => u.id === stall.ownerId)
  const manage = !!user && (user.role === 'admin' || stall.ownerId === user.id)
  const fav = !!user && (s.favorites[user.id] || []).includes(id)
  const pendingClaim = user && s.claims.some((c) => c.stallId === id && c.userId === user.id && c.status === 'pending')

  const startEdit = () => { setForm({ hours: stall.hours, desc: stall.desc }); setEditing(true) }
  const saveEdit = () => { if (tryDo(() => act.updateStall(id, form), 'Listing updated.')) setEditing(false) }
  const sendClaim = () => { if (tryDo(() => act.claimStall(id, note), 'Claim sent to the admins.')) { setClaiming(false); setNote('') } }

  return (
    <div className="page">
      <a className="muted small" href="#/stalls">‹ All stalls</a>

      <section className="stall-hero panel">
        <div className="big-tile" aria-hidden="true">{GENRE_EMOJI[stall.genre]}</div>
        <div className="grow">
          <h1 className="page-title">{stall.name}</h1>
          <div className="meta-row">
            <span className="cat">{stall.genre}</span>
            <span className="tier">{peso(stall.tier)}</span>
            {owner ? <Badge kind="ok">Verified owner</Badge> : <Badge kind="pend">Unclaimed</Badge>}
          </div>
          <Stars value={avg} count={count} size={20} />
          <p>{stall.desc}</p>
          <dl className="facts">
            <dt>Address</dt><dd>{stall.address}</dd>
            <dt>Hours</dt><dd>{stall.hours}</dd>
            <dt>Known for</dt><dd className="chips">{stall.dishes.map((d) => <span key={d} className="chip static">{d}</span>)}</dd>
          </dl>
          <div className="row wrap-row">
            <a className="btn primary" href={directions(stall)} target="_blank" rel="noreferrer">Get directions</a>
            <button className={'btn' + (fav ? ' on' : '')} aria-pressed={fav} onClick={() => tryDo(() => act.toggleFav(id), fav ? undefined : 'Saved to your favorites.')}>{fav ? '♥ Saved' : '♡ Save'}</button>
            {manage && !editing && <button className="btn" onClick={startEdit}>Edit listing</button>}
            {!stall.ownerId && !pendingClaim && <button className="btn" onClick={() => setClaiming(!claiming)}>Claim this listing</button>}
            {pendingClaim && <Badge kind="pend">Claim pending review</Badge>}
          </div>

          {claiming && (
            <div className="inline-form">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="How are you connected to this stall? Admins verify before approving." />
              <button className="primary" onClick={sendClaim}>Send claim</button>
            </div>
          )}
          {editing && (
            <div className="inline-form">
              <label>Operating hours<input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></label>
              <label>Description<textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>
              <div className="row"><button className="primary" onClick={saveEdit}>Save changes</button><button onClick={() => setEditing(false)}>Cancel</button></div>
            </div>
          )}
        </div>
      </section>

      <div className="stall-grid">
        <div className="stack">
          <div className="between wrap-row">
            <h2 className="section-title">Blog reviews & posts</h2>
            {user && !writing && <button className="primary" onClick={() => setWriting(true)}>Write a blog review</button>}
            {!user && <a className="btn" href="#/login">Log in to write a review</a>}
          </div>
          {writing && <Composer presetStall={id} presetCategory="Review" startOpen onClose={() => setWriting(false)} />}
          {posts.length === 0 && !writing && <Empty title="No blog reviews yet">Be the first to write about {stall.name}.</Empty>}
          {posts.map((p) => <PostCard key={p.id} p={p} />)}
        </div>

        <aside className="stall-side">
          <div className="panel rating-card">
            <div className="rating-big"><b>{avg ? avg.toFixed(1) : '–'}</b><div><Stars value={avg} size={18} /><div className="muted small">{count} blog {count === 1 ? 'review' : 'reviews'}</div></div></div>
            {[5, 4, 3, 2, 1].map((n) => {
              const c = rated.filter((r) => r.rating === n).length
              return <div key={n} className="bar-row"><span>{n}★</span><span className="bar"><i style={{ width: (count ? (c / count) * 100 : 0) + '%' }} /></span><span className="muted small">{c}</span></div>
            })}
          </div>
          <GoogleMap stall={stall} height={300} />
        </aside>
      </div>
    </div>
  )
}
