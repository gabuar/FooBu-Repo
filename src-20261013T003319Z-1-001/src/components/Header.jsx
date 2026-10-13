import { Logo } from './brand.jsx'
import { Avatar } from './ui.jsx'
import { act, me, useStore } from '../lib/store.js'
import { go } from '../lib/router.js'

const LINKS = [['home', '', 'Feed'], ['stalls', 'stalls', 'Stalls & map'], ['spin', 'spin', 'Spin the plate'], ['lists', 'lists', 'Curated lists']]

export default function Header({ route }) {
  const s = useStore()
  const user = me(s)
  return (
    <header className="top">
      <div className="top-row">
        <a href="#/" className="logo-link" aria-label="FooBu home"><Logo /></a>
        <nav className="nav">
          {LINKS.map(([name, path, label]) => (
            <a key={name} href={'#/' + path} className={route.name === name || (name === 'stalls' && route.name === 'stall') ? 'on' : ''}>{label}</a>
          ))}
        </nav>
        <div className="account">
          {user ? (
            <>
              <a className="me" href="#/profile"><Avatar name={user.name} size={26} />{user.name}{user.role !== 'user' && <span className="role">{user.role}</span>}</a>
              {user.role === 'admin' && <a className="btn" href="#/admin">Admin</a>}
              <button onClick={() => { act.logout(); go('') }}>Log out</button>
            </>
          ) : (
            <>
              <a className="btn" href="#/login">Log in</a>
              <a className="btn primary" href="#/signup">Sign up</a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
