import { useSyncExternalStore } from 'react'
import { buildSeed } from '../data/seed.js'

/*
  Frontend-only data layer. State lives in memory and is saved to localStorage so the demo survives refreshes.
  Every function in `act` maps to one future backend endpoint (see README), so when the Express + MongoDB
  backend is ready you only need to swap the bodies of these functions for fetch() calls.
*/

const KEY = 'foobu_v1'
const uid = (p) => p + Math.random().toString(36).slice(2, 9)
const fail = (m) => { throw new Error(m) }

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && s.v === 3) return s
  } catch { /* first run or corrupted storage */ }
  return buildSeed()
}

let state = load()
const subs = new Set()
const subscribe = (f) => { subs.add(f); return () => subs.delete(f) }
const commit = (patch) => {
  state = { ...state, ...patch }
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  subs.forEach((f) => f())
}
const upd = (key, fn) => commit({ [key]: fn(state[key]) })

export const useStore = () => useSyncExternalStore(subscribe, () => state)

/* ---------- selectors ---------- */
export const me = (s) => s.users.find((u) => u.id === s.session) || null
export const score = (p) => Object.values(p.votes).reduce((a, n) => a + n, 0)
export const publishedStalls = (s) => s.stalls.filter((x) => x.status === 'published')
// A stall's rating is the average of the blog reviews (posts with a star rating) written about it.
export const reviewsOf = (s, stallId) => s.posts.filter((p) => p.stallId === stallId && p.rating)
export const ratingOf = (s, stallId) => {
  const r = reviewsOf(s, stallId)
  return { avg: r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : 0, count: r.length }
}

/* ---------- guards ---------- */
const needUser = (what) => me(state) || fail(`Log in to ${what}.`)
const needAdmin = () => { const u = me(state); if (!u || u.role !== 'admin') fail('Admins only.'); return u }
const canManage = (u, stall) => u && (u.role === 'admin' || stall.ownerId === u.id)

export const act = {
  /* --- accounts (FR-01, FR-02) --- */
  signup({ name, email, pw }) {
    name = name.trim(); email = email.trim().toLowerCase()
    if (name.length < 2 || name.length > 24) fail('Display name needs 2 to 24 characters.')
    if (!/^\S+@\S+\.\S+$/.test(email)) fail('Enter a valid email address.')
    if (pw.length < 8) fail('Password needs 8 characters or more.')
    if (state.users.some((u) => u.email === email)) fail('That email already has an account.')
    const user = { id: uid('u-'), name, email, pw, role: 'user', joinedAt: Date.now() }
    commit({ users: [...state.users, user], session: user.id })
  },
  login({ email, pw }) {
    const u = state.users.find((x) => x.email === email.trim().toLowerCase() && x.pw && x.pw === pw)
    if (!u) fail('Email or password is incorrect.')
    commit({ session: u.id })
  },
  loginAs(role) {
    const u = state.users.find((x) => x.role === role && x.pw)
    commit({ session: u.id })
  },
  logout() { commit({ session: null }) },
  resetDemo() {
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
    commit({ ...buildSeed() })
  },

  /* --- blog posts, blog reviews, comments, votes (FR-09, FR-10) --- */
  createPost({ title, body, category, place = '', stallId = '', rating = 0, ordered = '' }) {
    const u = needUser('post')
    if (title.trim().length < 3 || body.trim().length < 3) fail('Add a title and some text first.')
    const review = category === 'Review'
    if (review) {
      if (!stallId) fail('Pick the stall you are reviewing.')
      if (!rating) fail('Add a star rating for your review.')
      if (body.trim().length < 20) fail('A blog review needs a few sentences (at least 20 characters).')
    }
    upd('posts', (p) => [{
      id: uid('p'), userId: u.id, author: u.name, category, stallId: stallId || null,
      rating: review ? rating : null, ordered: review ? ordered.trim() : '', place: place.trim(),
      title: title.trim(), body: body.trim(), createdAt: Date.now(), votes: {}, comments: [],
    }, ...p])
  },
  votePost(id, value) {
    const u = needUser('vote')
    upd('posts', (ps) => ps.map((p) => {
      if (p.id !== id) return p
      const votes = { ...p.votes }
      if (value === 0) delete votes[u.id]; else votes[u.id] = value
      return { ...p, votes }
    }))
  },
  addComment(postId, body) {
    const u = needUser('comment')
    if (!body.trim()) fail('Write something first.')
    upd('posts', (ps) => ps.map((p) => p.id !== postId ? p
      : { ...p, comments: [...p.comments, { id: uid('c'), userId: u.id, author: u.name, body: body.trim(), createdAt: Date.now() }] }))
  },
  deletePost(id) {
    const u = needUser('delete posts')
    const p = state.posts.find((x) => x.id === id)
    if (!p || (p.userId !== u.id && u.role !== 'admin')) fail('You cannot delete this post.')
    upd('posts', (ps) => ps.filter((x) => x.id !== id))
  },

  /* --- favorites (FR-11) --- */
  toggleFav(stallId) {
    const u = needUser('save favorites')
    const mine = state.favorites[u.id] || []
    commit({ favorites: { ...state.favorites, [u.id]: mine.includes(stallId) ? mine.filter((x) => x !== stallId) : [...mine, stallId] } })
  },

  /* --- owner claims and listing edits (FR-13, FR-14). Stall suggestions are now posts with the "Suggested place" flair (FR-12) --- */
  claimStall(stallId, note) {
    const u = needUser('claim a stall')
    const stall = state.stalls.find((s) => s.id === stallId)
    if (stall.ownerId) fail('This stall already has an owner.')
    if (state.claims.some((c) => c.stallId === stallId && c.userId === u.id && c.status === 'pending')) fail('You already have a pending claim.')
    if (note.trim().length < 3) fail('Tell the admins how you are connected to this stall.')
    upd('claims', (xs) => [{ id: uid('cl'), userId: u.id, author: u.name, stallId, note: note.trim(), createdAt: Date.now(), status: 'pending' }, ...xs])
  },
  updateStall(id, patch) {
    const u = needUser('edit a stall')
    const stall = state.stalls.find((s) => s.id === id)
    if (!canManage(u, stall)) fail('You cannot edit this stall.')
    const { hours, desc } = patch
    upd('stalls', (xs) => xs.map((s) => s.id === id ? { ...s, hours: hours.trim() || s.hours, desc: desc.trim() || s.desc } : s))
  },

  /* --- reports (FR-16) --- */
  report({ type, id, postId = null, reason }) {
    const u = needUser('report')
    if (state.reports.some((r) => r.targetId === id && r.by === u.name && r.status === 'open')) fail('You already reported this.')
    upd('reports', (xs) => [{ id: uid('rp'), type, targetId: id, postId, reason, by: u.name, createdAt: Date.now(), status: 'open' }, ...xs])
  },

  /* --- admin (FR-17) --- */
  decideClaim(id, approve) {
    needAdmin()
    const c = state.claims.find((x) => x.id === id)
    if (approve) {
      commit({
        stalls: state.stalls.map((s) => s.id === c.stallId ? { ...s, ownerId: c.userId } : s),
        users: state.users.map((u) => u.id === c.userId && u.role === 'user' ? { ...u, role: 'owner' } : u),
      })
    }
    upd('claims', (xs) => xs.map((x) => x.id === id ? { ...x, status: approve ? 'approved' : 'rejected' } : x))
  },
  resolveReport(id, remove) {
    needAdmin()
    const r = state.reports.find((x) => x.id === id)
    if (remove) {
      if (r.type === 'post') upd('posts', (ps) => ps.filter((p) => p.id !== r.targetId))
      if (r.type === 'comment') upd('posts', (ps) => ps.map((p) => ({ ...p, comments: p.comments.filter((c) => c.id !== r.targetId) })))
    }
    upd('reports', (xs) => xs.map((x) => x.id === id ? { ...x, status: remove ? 'removed' : 'dismissed' } : x))
  },
  createList({ title, description, stallIds }) {
    needAdmin()
    if (title.trim().length < 3) fail('Give the list a title.')
    if (stallIds.length < 2) fail('Pick at least two stalls.')
    upd('lists', (xs) => [{ id: uid('l'), title: title.trim(), description: description.trim(), stallIds }, ...xs])
  },
  deleteList(id) { needAdmin(); upd('lists', (xs) => xs.filter((x) => x.id !== id)) },
}
