import { useState } from 'react'
import { CATEGORIES, FLAIR_COLORS } from '../data/seed.js'
import { Avatar, StarPick } from './ui.jsx'
import { act, me, publishedStalls, useStore } from '../lib/store.js'
import { tryDo } from '../lib/toast.js'

const blank = (category, stallId) => ({ title: '', body: '', category, place: '', stallId, rating: 0, ordered: '' })

// Collapsed it is a single "write something" bar; click it to open the full blog post form.
export default function Composer({ presetStall = '', presetCategory = CATEGORIES[0], startOpen = false, onClose }) {
  const s = useStore()
  const user = me(s)
  const [open, setOpen] = useState(startOpen)
  const [d, setD] = useState(blank(presetCategory, presetStall))
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value })
  const review = d.category === 'Review'
  const suggest = d.category === 'Suggested place'

  const close = () => { setOpen(false); setD(blank(d.category, presetStall)); if (onClose) onClose() }
  const publish = () => {
    if (tryDo(() => act.createPost(d), review ? 'Your blog review is live.' : 'Posted to the feed.')) close()
  }

  if (!open) {
    return (
      <div className="composer-bar panel">
        {user ? <Avatar name={user.name} /> : <span className="avatar anon">?</span>}
        {user
          ? <button className="composer-trigger" onClick={() => setOpen(true)}>What did you eat lately? Write a blog post or review…</button>
          : <a className="composer-trigger" href="#/login">Log in to write a blog post or review…</a>}
        {user && <button className="primary" onClick={() => setOpen(true)}>Write</button>}
      </div>
    )
  }

  return (
    <section className="composer panel">
      <div className="flairs" role="radiogroup" aria-label="Post flair">
        {CATEGORIES.map((c) => (
          <button type="button" key={c} role="radio" aria-checked={d.category === c} className={'flair-pick' + (d.category === c ? ' on' : '')}
            style={{ '--fc': FLAIR_COLORS[c] }} onClick={() => setD({ ...d, category: c })}>{c}</button>
        ))}
      </div>

      <input value={d.title} onChange={set('title')} autoFocus
        placeholder={review ? 'Give your review a headline' : suggest ? 'Which place should everyone try?' : 'Title'} aria-label="Title" />

      {review && (
        <div className="rate-row">
          <div><span className="muted small">Your rating</span><StarPick value={d.rating} onChange={(n) => setD({ ...d, rating: n })} /></div>
          <input value={d.ordered} onChange={set('ordered')} placeholder="What did you order? (optional)" aria-label="What did you order" />
        </div>
      )}
      {suggest && <input value={d.place} onChange={set('place')} placeholder="Where is it? Street or landmark (optional)" aria-label="Place" />}

      <textarea value={d.body} onChange={set('body')} aria-label="Post body"
        placeholder={review ? 'Tell the story: how was the food, the price, the vibe? Would you go back?' : suggest ? 'What do you order there and why?' : 'Share it with the barkada...'} />

      <div className="row">
        {!presetStall && (
          <select value={d.stallId} onChange={set('stallId')} aria-label="Stall">
            <option value="">{review ? 'Which stall are you reviewing?' : 'Tag a listed stall (optional)'}</option>
            {publishedStalls(s).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        )}
        <span className="grow" />
        <button onClick={close}>Cancel</button>
        <button className="primary" onClick={publish}>{review ? 'Publish review' : 'Post'}</button>
      </div>
    </section>
  )
}
