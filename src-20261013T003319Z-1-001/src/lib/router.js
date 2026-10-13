import { useEffect, useState } from 'react'

// Tiny hash router: "#/stall/mang-tootz" -> { name: 'stall', params: ['mang-tootz'] }
const parse = () => {
  const [name = '', ...rest] = window.location.hash.replace(/^#\/?/, '').split('/')
  return { name: name || 'home', params: rest.map(decodeURIComponent) }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => { setRoute(parse()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const go = (path = '') => { window.location.hash = '/' + path }
