export const ago = (t) => {
  const m = Math.floor((Date.now() - t) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
}

export const peso = (tier) => '₱'.repeat(tier)
export const initial = (n = '?') => n[0].toUpperCase()

const COLORS = ['#e8742f', '#c0392b', '#7a9a1f', '#d99a00', '#b04a7a', '#3f8f86']
export const colorOf = (s = '?') => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]

// Google finds the place by name + address, so no coordinates are needed.
export const placeQuery = (s) => encodeURIComponent(`${s.name}, ${s.address}`)
export const directions = (s) => `https://www.google.com/maps/dir/?api=1&destination=${placeQuery(s)}`
export const mapsLink = (s) => `https://www.google.com/maps/search/?api=1&query=${placeQuery(s)}`

// "Hot" ranking like Reddit: score decays with age.
export const hot = (score, createdAt) => score / Math.pow((Date.now() - createdAt) / 3600000 + 2, 1.5)
