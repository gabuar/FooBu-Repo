import { useState } from 'react'
import { colorOf, initial } from '../lib/format.js'
import { useToasts, tryDo } from '../lib/toast.js'
import { act } from '../lib/store.js'

export const Avatar = ({ name, size = 34 }) => (
  <span className="avatar" style={{ background: colorOf(name), width: size, height: size, fontSize: size * 0.45 }}>{initial(name)}</span>
)

export const Badge = ({ kind = 'pend', children }) => <span className={'badge ' + kind}>{children}</span>

// Read-only stars. The gold layer is clipped to the average, so 4.3 shows 4.3 stars filled.
export function Stars({ value = 0, count, size = 16 }) {
  return (
    <span className="stars" title={value ? value.toFixed(1) + ' out of 5' : 'No ratings yet'}>
      <span className="star-track" style={{ fontSize: size }}>
        <span className="star-fill" style={{ width: (value / 5) * 100 + '%' }}>★★★★★</span>
        ★★★★★
      </span>
      <span className="muted small">{value ? value.toFixed(1) : 'New'}{count !== undefined && ` (${count})`}</span>
    </span>
  )
}

// Interactive star picker: hover to preview, click to set.
export function StarPick({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <span className="star-pick" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} className={n <= shown ? 'on' : ''} onMouseEnter={() => setHover(n)} onClick={() => onChange(n)}
          role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}>★</button>
      ))}
    </span>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="between"><h2>{title}</h2><button className="ghost" onClick={onClose} aria-label="Close">✕</button></div>
        {children}
      </div>
    </div>
  )
}

export function Toasts() {
  const list = useToasts()
  return (
    <div className="toasts" aria-live="polite">
      {list.map((t) => <div key={t.id} className={'toast ' + t.kind}>{t.text}</div>)}
    </div>
  )
}

export const Empty = ({ title, children }) => (
  <div className="panel empty"><b>{title}</b><p className="muted">{children}</p></div>
)

const REASONS = ['Spam', 'Abusive', 'Wrong info']
export function ReportButton({ type, id, postId }) {
  const [open, setOpen] = useState(false)
  if (!open) return <button className="ghost" onClick={() => setOpen(true)}>Report</button>
  return (
    <span className="report-pick">
      {REASONS.map((r) => (
        <button key={r} className="chip" onClick={() => { if (tryDo(() => act.report({ type, id, postId, reason: r }), 'Reported. Admins will take a look.')) setOpen(false) }}>{r}</button>
      ))}
      <button className="ghost" onClick={() => setOpen(false)}>Cancel</button>
    </span>
  )
}

// Password field with a show/hide toggle.
export function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false)
  return (
    <span className="password-input">
      <input {...props} className={className} type={visible ? 'text' : 'password'} />
      <button type="button" className="password-toggle" onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} title={visible ? 'Hide password' : 'Show password'}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {visible
            ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A11.5 11.5 0 0 1 12 5c5 0 8.5 4.2 9.5 7-.4 1.1-1.2 2.3-2.3 3.4M6.2 6.2C4.2 7.5 2.9 9.6 2.5 12c.6 1.8 2.2 3.8 4.4 5.1A10.3 10.3 0 0 0 12 19c.8 0 1.6-.1 2.3-.3" /></>
            : <><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="3" /></>}
        </svg>
      </button>
    </span>
  )
}
