import { useState } from 'react'
import { Bauhaus, Logo } from '../components/brand.jsx'
import { PasswordInput } from '../components/ui.jsx'
import { act } from '../lib/store.js'
import { go } from '../lib/router.js'
import { toast } from '../lib/toast.js'

// Full-screen Log in / Sign up. Sign-up is a plain courtesy form: name, email, password.
export default function Auth({ mode }) {
  const signup = mode === 'signup'
  const [f, setF] = useState({ name: '', email: '', pw: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr('') }

  const submit = (e) => {
    e.preventDefault()
    try {
      if (signup) act.signup(f); else act.login(f)
      toast(signup ? 'Welcome to FooBu! Your account is ready.' : 'Welcome back.', 'ok')
      go('')
    } catch (x) { setErr(x.message) }
  }
  const demo = (role) => { act.loginAs(role); toast(`Signed in with the demo ${role} account.`, 'ok'); go(role === 'admin' ? 'admin' : '') }

  return (
    <div className="auth-split">
      <aside className="auth-aside">
        <Bauhaus />
        <div>
          <div className="auth-logo-float"><span className="auth-logo-badge"><Logo size={64} text={false} /></span></div>
          <h1>Welcome to FooBu</h1>
          <p className="auth-tagline">Your food buddy for every stall in Sampaloc!</p>
          <ul className="auth-points">
            <li>Read stalls, reviews and the feed as a guest, no account needed.</li>
            <li>Sign up to write blog posts and reviews, comment and vote.</li>
            <li>Save your favorite stalls and share places others should try.</li>
          </ul>
        </div>
        <a className="auth-guest" href="#/">Browse as a guest</a>
      </aside>

      <main className="auth-side">
        <div className="auth-folder">
          <div className="auth-tabs" role="tablist">
            <a role="tab" aria-selected={!signup} className={'auth-tab' + (!signup ? ' on' : '')} href="#/login">Log in</a>
            <a role="tab" aria-selected={signup} className={'auth-tab' + (signup ? ' on' : '')} href="#/signup">Sign up</a>
          </div>
          <form className="auth-body" onSubmit={submit}>
            <h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
            <p className="muted small">{signup ? 'It only takes a minute. Anyone can join.' : 'Log in to post, review and save favorites.'}</p>
            {signup && <label>Display name<input value={f.name} onChange={set('name')} placeholder="Juan D." autoComplete="nickname" /></label>}
            <label>Email<input type="email" value={f.email} onChange={set('email')} placeholder="juan@gmail.com" autoComplete="email" /></label>
            <label>Password<PasswordInput value={f.pw} onChange={set('pw')} placeholder={signup ? 'At least 8 characters' : ''} autoComplete={signup ? 'new-password' : 'current-password'} /></label>
            {err && <p className="err" role="alert">{err}</p>}
            <button className="primary" type="submit">{signup ? 'Create account' : 'Log in'}</button>

            <div className="demo-box">
              <p className="muted small">Presenting? Jump in with a demo role.</p>
              <div className="row wrap-row">
                <button type="button" onClick={() => demo('user')}>Demo user</button>
                <button type="button" onClick={() => demo('owner')}>Demo owner</button>
                <button type="button" onClick={() => demo('admin')}>Demo admin</button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
