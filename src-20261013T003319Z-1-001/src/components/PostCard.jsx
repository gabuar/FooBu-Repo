import { useState } from 'react'
import { Avatar, Badge, ReportButton, Stars } from './ui.jsx'
import { FLAIR_COLORS } from '../data/seed.js'
import { ago } from '../lib/format.js'
import { act, me, score, useStore } from '../lib/store.js'
import { tryDo } from '../lib/toast.js'

export default function PostCard({ p }) {
  const s = useStore()
  const user = me(s)
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const [text, setText] = useState('')
  const stall = p.stallId && s.stalls.find((x) => x.id === p.stallId)
  const total = score(p)
  const mine = user ? p.votes[user.id] || 0 : 0
  const vote = (v) => tryDo(() => act.votePost(p.id, mine === v ? 0 : v))
  const canDelete = user && (p.userId === user.id || user.role === 'admin')
  const long = p.body.length > 340
  const send = () => { if (tryDo(() => act.addComment(p.id, text))) setText('') }

  return (
    <article className="post panel" style={{ '--fc': FLAIR_COLORS[p.category] }}>
      <div className="votes">
        <button className={'vote' + (mine === 1 ? ' up on' : '')} onClick={() => vote(1)} aria-label="Sarap (upvote)" aria-pressed={mine === 1} title="Sarap!">▲</button>
        <b key={total} className="score">{total}</b>
        <button className={'vote' + (mine === -1 ? ' down on' : '')} onClick={() => vote(-1)} aria-label="Sablay (downvote)" aria-pressed={mine === -1} title="Sablay">▼</button>
      </div>

      <div className="post-main">
        <div className="post-head">
          <Avatar name={p.author} size={30} />
          <span className="who"><b>{p.author}</b> <span className="muted small">· {ago(p.createdAt)}</span></span>
          <span className="flair">{p.category}</span>
        </div>

        <h3 className="post-title">{p.title}</h3>

        {(p.rating || stall || p.place) && (
          <div className="post-where">
            {stall && <a className="stall-chip" href={'#/stall/' + stall.id}>{stall.name}</a>}
            {p.rating ? <Stars value={p.rating} size={15} /> : null}
            {p.ordered && <span className="muted small">Ordered: {p.ordered}</span>}
            {p.place && <span className="muted small">📍 {p.place}</span>}
          </div>
        )}

        <div className={'post-body' + (long && !more ? ' clamped' : '')}>
          {p.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
        </div>
        {long && <button className="link-more" onClick={() => setMore(!more)}>{more ? 'Show less' : 'Read the full post'}</button>}

        <div className="post-actions">
          <button className="ghost" onClick={() => setOpen(!open)}>💬 {p.comments.length} {p.comments.length === 1 ? 'comment' : 'comments'}</button>
          <ReportButton type="post" id={p.id} />
          {canDelete && <button className="ghost danger" onClick={() => tryDo(() => act.deletePost(p.id), 'Post deleted.')}>Delete</button>}
        </div>

        {open && (
          <div className="comments">
            {p.comments.map((c) => (
              <div key={c.id} className="comment">
                <Avatar name={c.author} size={28} />
                <div>
                  <b>{c.author}</b> {stall && c.userId === stall.ownerId && <Badge kind="ok">Owner</Badge>} <span className="muted small">{ago(c.createdAt)}</span>
                  <div>{c.body}</div>
                  <ReportButton type="comment" id={c.id} postId={p.id} />
                </div>
              </div>
            ))}
            <div className="row">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={user ? 'Add a comment' : 'Log in to comment'}
                onKeyDown={(e) => e.key === 'Enter' && text.trim() && send()} />
              <button disabled={!text.trim()} onClick={send}>Reply</button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
