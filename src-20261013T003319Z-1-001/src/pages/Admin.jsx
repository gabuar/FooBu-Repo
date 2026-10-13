import { useState } from 'react'
import { ago } from '../lib/format.js'
import { act, me, publishedStalls, useStore } from '../lib/store.js'
import { tryDo } from '../lib/toast.js'
import { Badge, Empty } from '../components/ui.jsx'

const preview = (s, r) => {
  if (r.type === 'post') return (s.posts.find((p) => p.id === r.targetId) || {}).title
  const c = s.posts.flatMap((p) => p.comments).find((x) => x.id === r.targetId)
  return c && c.body
}

export default function Admin() {
  const s = useStore()
  const user = me(s)
  const [tab, setTab] = useState('claims')
  const [draft, setDraft] = useState({ title: '', description: '', stallIds: [] })

  if (!user || user.role !== 'admin') return <Empty title="Admins only">Log in with an admin account to manage FooBu. <a href="#/login">Log in</a></Empty>

  const claims = s.claims.filter((x) => x.status === 'pending')
  const reports = s.reports.filter((x) => x.status === 'open')
  const toggle = (id) => setDraft({ ...draft, stallIds: draft.stallIds.includes(id) ? draft.stallIds.filter((x) => x !== id) : [...draft.stallIds, id] })
  const publish = () => { if (tryDo(() => act.createList(draft), 'List published.')) setDraft({ title: '', description: '', stallIds: [] }) }
  const stallName = (id) => (s.stalls.find((x) => x.id === id) || {}).name

  const tabs = [['claims', `Owner claims (${claims.length})`], ['reports', `Reports (${reports.length})`], ['lists', 'Curated lists']]

  return (
    <div className="page">
      <h1 className="page-title">Admin dashboard</h1>
      <div className="stats">
        <div className="panel stat"><b>{publishedStalls(s).length}</b>published stalls</div>
        <div className="panel stat"><b>{s.posts.length}</b>posts</div>
        <div className="panel stat"><b>{claims.length}</b>claims waiting</div>
        <div className="panel stat"><b>{reports.length}</b>open reports</div>
      </div>

      <div className="sorts" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </div>

      <div className="stack">
        {tab === 'claims' && (claims.length === 0 ? <Empty title="No claims waiting">Owner claims show up here.</Empty> : claims.map((x) => (
          <div key={x.id} className="panel between wrap-row">
            <div><b>{x.author}</b> wants to manage <a href={'#/stall/' + x.stallId}>{stallName(x.stallId)}</a><div className="muted small">{ago(x.createdAt)}</div><p>{x.note}</p></div>
            <div className="row"><button className="primary" onClick={() => tryDo(() => act.decideClaim(x.id, true), 'Claim approved. The user is now an owner.')}>Approve</button><button onClick={() => tryDo(() => act.decideClaim(x.id, false), 'Claim rejected.')}>Reject</button></div>
          </div>
        )))}

        {tab === 'reports' && (reports.length === 0 ? <Empty title="No open reports">Flagged posts, comments and reviews show up here.</Empty> : reports.map((r) => (
          <div key={r.id} className="panel between wrap-row">
            <div><Badge kind="no">{r.reason}</Badge> <b>{r.type}</b> reported by {r.by} <span className="muted small">{ago(r.createdAt)}</span><p className="quote">{preview(s, r) || 'Content no longer exists.'}</p></div>
            <div className="row"><button className="danger-btn" onClick={() => tryDo(() => act.resolveReport(r.id, true), 'Content removed.')}>Remove content</button><button onClick={() => tryDo(() => act.resolveReport(r.id, false), 'Report dismissed.')}>Dismiss</button></div>
          </div>
        )))}

        {tab === 'lists' && (
          <>
            <div className="panel">
              <h3>New curated list</h3>
              <label>Title<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Best pares places" /></label>
              <label>Description<input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="One line about the list" /></label>
              <div className="chips">
                {publishedStalls(s).map((st) => <button key={st.id} className={'chip' + (draft.stallIds.includes(st.id) ? ' on' : '')} onClick={() => toggle(st.id)}>{st.name}</button>)}
              </div>
              <button className="primary" onClick={publish}>Publish list</button>
            </div>
            {s.lists.map((l) => (
              <div key={l.id} className="panel between wrap-row">
                <div><b>{l.title}</b><div className="muted small">{l.stallIds.length} stalls · {l.description}</div></div>
                <button className="danger-btn" onClick={() => tryDo(() => act.deleteList(l.id), 'List deleted.')}>Delete</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
