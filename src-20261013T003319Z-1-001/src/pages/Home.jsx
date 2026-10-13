import { useState } from 'react'
import { CATEGORIES, FLAIR_COLORS } from '../data/seed.js'
import { hot } from '../lib/format.js'
import { go } from '../lib/router.js'
import { me, publishedStalls, ratingOf, score, useStore } from '../lib/store.js'
import { Bauhaus } from '../components/brand.jsx'
import { Badge } from '../components/ui.jsx'
import Composer from '../components/Composer.jsx'
import PostCard from '../components/PostCard.jsx'
import StallCard from '../components/StallCard.jsx'

export default function Home() {
  const s = useStore()
  const user = me(s)
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('hot')
  const [q, setQ] = useState('')

  const shown = s.posts
    .filter((p) => cat === 'All' || p.category === cat)
    .sort((a, b) => sort === 'new' ? b.createdAt - a.createdAt
      : sort === 'top' ? score(b) - score(a)
      : hot(score(b), b.createdAt) - hot(score(a), a.createdAt))
  const top = publishedStalls(s)
    .map((st) => ({ st, ...ratingOf(s, st.id) }))
    .sort((a, b) => b.avg - a.avg || b.count - a.count)
    .slice(0, 4)
  const reviewCount = s.posts.filter((p) => p.rating).length
  const search = (e) => { e.preventDefault(); go(q.trim() ? 'stalls/q/' + encodeURIComponent(q.trim()) : 'stalls') }

  return (
    <>
      <section className="hero">
        <Bauhaus />
        <div className="hero-copy">
          <h1>Hungry in Sampaloc?</h1>
          <p>Blog reviews, hidden finds and honest takes on the food stalls around UST, España and Dapitan, written by the people who eat there.</p>
          <form className="hero-search" onSubmit={search} role="search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a stall, dish or street" aria-label="Search stalls" />
            <button className="primary">Search</button>
          </form>
          <div className="hero-links">
            <a className="btn" href="#/spin">🎡 Spin the plate</a>
            <a className="btn" href="#/stalls">🗺️ Browse the map</a>
          </div>
        </div>
      </section>

      <div className="layout">
        <section className="stream">
          <Composer />
          <div className="feed-bar">
            <div className="chips">
              <button className={'chip' + (cat === 'All' ? ' on' : '')} onClick={() => setCat('All')}>All posts</button>
              {CATEGORIES.map((c) => (
                <button key={c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>
                  <i className="dot" style={{ background: FLAIR_COLORS[c] }} />{c}
                </button>
              ))}
            </div>
            <div className="sorts" role="tablist" aria-label="Sort posts">
              {[['hot', 'Hot'], ['new', 'New'], ['top', 'Top']].map(([k, l]) => (
                <button key={k} role="tab" aria-selected={sort === k} className={sort === k ? 'on' : ''} onClick={() => setSort(k)}>{l}</button>
              ))}
            </div>
          </div>
          {shown.length === 0 && <div className="panel empty"><b>Nothing here yet</b><p className="muted">Try another flair, or be the first to write one.</p></div>}
          {shown.map((p) => <PostCard key={p.id} p={p} />)}
        </section>

        <aside className="side">
          <a className="teaser" href="#/spin">
            <b>Can't decide?</b>
            <span>Spin the plate and let it pick your next meal.</span>
            <i aria-hidden="true">🎡</i>
          </a>
          <div className="panel side-card">
            <h3>Popular stalls</h3>
            <div className="stack">{top.map(({ st }) => <StallCard key={st.id} stall={st} compact />)}</div>
            <a className="small" href="#/stalls">See all {publishedStalls(s).length} stalls</a>
          </div>
          <div className="panel side-card">
            <h3>Your account</h3>
            {user
              ? <p><Badge kind="ok">{user.role}</Badge> <span className="muted small">Signed in as {user.name}</span></p>
              : <p className="muted small">Browsing as a guest. <a href="#/signup">Create an account</a> to write posts and reviews.</p>}
            <p className="muted small">{publishedStalls(s).length} stalls · {reviewCount} blog {reviewCount === 1 ? 'review' : 'reviews'} · {s.posts.length} {s.posts.length === 1 ? 'post' : 'posts'}</p>
          </div>
        </aside>
      </div>
    </>
  )
}
