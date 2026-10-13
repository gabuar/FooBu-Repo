import { useState } from 'react'
import { GENRE_EMOJI } from '../data/seed.js'
import { publishedStalls, useStore } from '../lib/store.js'

function ListCard({ list, stalls }) {
  const [pick, setPick] = useState(null)
  const items = list.stallIds.map((id) => stalls.find((s) => s.id === id)).filter(Boolean)
  const shuffle = () => setPick(items[Math.floor(Math.random() * items.length)])
  return (
    <article className="panel list-card">
      <h2>{list.title}</h2>
      <p className="muted">{list.description}</p>
      <ol className="list-items">
        {items.map((st) => (
          <li key={st.id}><a href={'#/stall/' + st.id}><span aria-hidden="true">{GENRE_EMOJI[st.genre]}</span> {st.name}<small className="muted">{st.area}</small></a></li>
        ))}
      </ol>
      <div className="row">
        <button onClick={shuffle} disabled={!items.length}>Pick one for me</button>
        {pick && <a key={pick.id + Math.random()} className="pick-result" href={'#/stall/' + pick.id}>Go to {pick.name}</a>}
      </div>
    </article>
  )
}

export default function Lists() {
  const s = useStore()
  const stalls = publishedStalls(s)
  return (
    <div className="page">
      <h1 className="page-title">Curated lists</h1>
      <p className="muted">Hand-picked by the FooBu admins. Same stalls, different cravings.</p>
      <div className="lists-grid">
        {s.lists.map((l) => <ListCard key={l.id} list={l} stalls={stalls} />)}
      </div>
    </div>
  )
}
