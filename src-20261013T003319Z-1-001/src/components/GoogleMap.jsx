import { placeQuery } from '../lib/format.js'

// Embeds Google Maps. Google finds the stall by name + address, so we do not store coordinates.
// - No setup: uses the free embed link (no API key).
// - Optional: put VITE_GOOGLE_MAPS_KEY in a .env file to use the official Maps Embed API instead.
const KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

export default function GoogleMap({ stall, height = 440 }) {
  const q = stall ? placeQuery(stall) : encodeURIComponent('food stalls near UST, Sampaloc, Manila')
  const src = KEY
    ? `https://www.google.com/maps/embed/v1/${stall ? 'place' : 'search'}?key=${KEY}&q=${q}&zoom=16`
    : `https://www.google.com/maps?q=${q}&z=16&output=embed`
  return (
    <iframe className="map" style={{ height }} src={src} title={stall ? `Map of ${stall.name}` : 'Map of Sampaloc'}
      loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
  )
}
