import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 48px',
      background: '#f9f9f7',
      borderBottom: '1px solid #e8e8e4',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: '#111',
        }}>
          Sci<span style={{ color: '#4A6CF7' }}>Sim</span> AI
        </div>
      </Link>

      {/* Desktop nav */}
      <div style={{
        display: 'flex',
        gap: '32px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#444',
      }}
        className="hidden md:flex"
      >
        <Link to="/lab" style={{ textDecoration: 'none', color: 'inherit' }}>Labs</Link>
        <Link to="/#how" style={{ textDecoration: 'none', color: 'inherit' }}>How it works</Link>
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
      </div>

      {/* Desktop buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className="hidden md:flex">
        <button className="btn-outline">Log in</button>
        <button className="btn-fill" onClick={() => navigate('/lab')}>
          Try for free →
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#f9f9f7',
          borderBottom: '1px solid #e8e8e4',
          padding: '20px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99,
        }}>
          <Link to="/lab" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}
            onClick={() => setMobileOpen(false)}>Labs</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#444', fontWeight: 500 }}
            onClick={() => setMobileOpen(false)}>About</Link>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button className="btn-outline">Log in</button>
            <button className="btn-fill" onClick={() => { navigate('/lab'); setMobileOpen(false); }}>
              Try for free →
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
