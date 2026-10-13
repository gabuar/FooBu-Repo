import { useRoute } from './lib/router.js'
import { act } from './lib/store.js'
import { toast } from './lib/toast.js'
import Header from './components/Header.jsx'
import { Toasts } from './components/ui.jsx'
import Home from './pages/Home.jsx'
import Stalls from './pages/Stalls.jsx'
import Stall from './pages/Stall.jsx'
import Spin from './pages/Spin.jsx'
import Lists from './pages/Lists.jsx'
import Profile from './pages/Profile.jsx'
import Auth from './pages/Auth.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  const route = useRoute()

  // Log in and Sign up are their own full-screen view, outside the blog layout.
  if (route.name === 'login' || route.name === 'signup') {
    return (<><Auth mode={route.name} /><Toasts /></>)
  }

  let page
  switch (route.name) {
    case 'stalls': page = <Stalls route={route} />; break
    case 'stall': page = <Stall id={route.params[0]} />; break
    case 'spin': page = <Spin />; break
    case 'lists': page = <Lists />; break
    case 'profile': page = <Profile />; break
    case 'admin': page = <Admin />; break
    default: page = <Home />
  }

  return (
    <>
      <Header route={route} />
      <main className="wrap">{page}</main>
      <footer className="foot">
        <span>FooBu (FoodBuddies) · Frontend prototype · COM242 Software Engineering 1</span>
        <button className="link" onClick={() => { act.resetDemo(); toast('Demo data reset.', 'ok') }}>Reset demo data</button>
      </footer>
      <Toasts />
    </>
  )
}
