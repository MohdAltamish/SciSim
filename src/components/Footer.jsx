import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '32px 48px',
      borderTop: '1px solid #e8e8e4',
      fontSize: '13px',
      color: '#999',
    }}>
      Built for <span style={{ color: '#4A6CF7', fontWeight: 700 }}>DSH Hacks V1</span> · SciSim AI · AI × STEM Education
      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <Link to="/about" style={{ color: '#999', textDecoration: 'none' }}>About</Link>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>GitHub</a>
      </div>
    </footer>
  )
}
