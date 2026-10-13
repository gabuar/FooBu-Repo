// A plate seen from above, drawn with Bauhaus shapes: circle, wedge and dot.
export function Logo({ size = 36, text = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="#dd4f2f" />
        <circle cx="32" cy="32" r="21" fill="#fff6e0" />
        <path d="M32 32V11a21 21 0 0 1 18.2 10.5z" fill="#f2a93b" />
        <circle cx="25" cy="39" r="5.5" fill="#2f7a5b" />
      </svg>
      {text && <span className="logo-text">FooBu</span>}
    </span>
  )
}

// Decorative Bauhaus shapes. The parent decides where they sit (see styles/bauhaus.css).
export const Bauhaus = () => (
  <span className="bauhaus" aria-hidden="true"><i className="bh c1" /><i className="bh c2" /><i className="bh c3" /><i className="bh c4" /></span>
)
