import SpinWheel from '../components/SpinWheel.jsx'

export default function Spin() {
  return (
    <div className="page">
      <div>
        <h1 className="page-title">Spin the plate</h1>
        <p className="muted">Too many good options? Pick a mood, spin the plate and let it choose where you eat in Sampaloc.</p>
      </div>
      <SpinWheel />
    </div>
  )
}
