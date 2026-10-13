import { useState } from 'react'
import { me, score, useStore } from '../lib/store.js'
import { Avatar, Badge, Empty } from '../components/ui.jsx'
import PostCard from '../components/PostCard.jsx'
import StallCard from '../components/StallCard.jsx'

export default function Profile() {
  const s = useStore()
  const user = me(s)
  const [tab, setTab] = useState('posts')
  if (!user) return <Empty title="Log in to see your profile">Your posts, blog reviews and favorite stalls live here. <a href="#/login">Log in</a> or <a href="#/signup">sign up</a>.</Empty>

  const posts = s.posts.filter((p) => p.userId === user.id)
  const reviews = posts.filter((p) => p.rating)
  const favs = (s.favorites[user.id] || []).map((id) => s.stalls.find((x) => x.id === id)).filter(Boolean)
  const owned = s.stalls.filter((x) => x.ownerId === user.id)
  const karma = posts.reduce((a, p) => a + score(p), 0)
  const list = tab === 'reviews' ? reviews : posts

  return (
    <div className="page">
      <section className="panel profile-head">
        <Avatar name={user.name} size={72} />
        <div>
          <h1 className="page-title">{user.name}</h1>
          <p className="muted">{user.email} · joined {new Date(user.joinedAt).toLocaleDateString()}</p>
          <div className="row"><Badge kind="ok">{user.role}</Badge><span className="muted small">{posts.length} posts · {reviews.length} blog reviews · {karma} sarap points</span></div>
          {owned.length > 0 && <p className="small">You manage: {owned.map((o) => <a key={o.id} href={'#/stall/' + o.id}>{o.name} </a>)}</p>}
        </div>
      </section>

      <div className="sorts" role="tablist">
        {[['posts', `Posts (${posts.length})`], ['reviews', `Blog reviews (${reviews.length})`], ['favs', `Favorites (${favs.length})`]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      <div className="stack">
        {tab !== 'favs' && (list.length ? list.map((p) => <PostCard key={p.id} p={p} />) : <Empty title="Nothing here yet">Write your first blog post or review from the feed.</Empty>)}
        {tab === 'favs' && (favs.length ? favs.map((st) => <StallCard key={st.id} stall={st} />) : <Empty title="No favorites yet">Tap the heart on any stall to save it here.</Empty>)}
      </div>
    </div>
  )
}
