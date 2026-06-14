import { Link } from 'react-router-dom'
import { Beaker, Atom, Microscope, Bot, Code, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 32px 80px' }}>
      <div style={{
        display: 'inline-block',
        background: '#FFF9C4',
        border: '1.5px solid #e8d800',
        borderRadius: '99px',
        padding: '6px 16px',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: '#5a4e00',
        marginBottom: '20px',
      }}>
        AI × STEM EDUCATION
      </div>

      <h1 style={{
        fontSize: '36px',
        fontWeight: 900,
        letterSpacing: '-1px',
        lineHeight: 1.1,
        marginBottom: '20px',
      }}>
        About <span style={{ color: '#4A6CF7' }}>SciSim AI</span>
      </h1>

      <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444', marginBottom: '32px' }}>
        SciSim AI is an AI-powered virtual science laboratory platform that makes chemistry, physics, and biology
        experiments accessible to any student with a browser — no physical equipment required.
      </p>

      <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#555', marginBottom: '24px' }}>
        Students choose from three labs: the <strong>Chemistry Lab</strong> (mix virtual chemicals, visualize reactions,
        see safety warnings), the <strong>Physics Lab</strong> (simulate pendulums, projectiles, and wave interference
        with live graphs), and the <strong>Biology Lab</strong> (explore 3D cell models with clickable organelles).
      </p>

      <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#555', marginBottom: '40px' }}>
        Across all three, an <strong>AI Lab Partner</strong> powered by Claude answers questions in real time, explains the
        science behind each simulation, and generates a structured lab report at the end of every session.
      </p>

      {/* Mission */}
      <div style={{
        background: '#f0f0ee',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '32px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>🌍 Why this matters</h2>
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#444' }}>
          Millions of students worldwide attend schools without functioning science labs. SciSim replaces the need for
          glassware, chemicals, and equipment with interactive simulations guided by AI — turning any device into a
          full science lab.
        </p>
      </div>

      {/* Tech Stack */}
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
        Tech stack
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '40px',
      }}>
        {[
          { icon: <Code size={18} />, label: 'React 18 + Vite', detail: 'Frontend framework' },
          { icon: <Globe size={18} />, label: 'Tailwind CSS', detail: 'Styling' },
          { icon: <Beaker size={18} />, label: 'p5.js', detail: 'Physics & chem sims' },
          { icon: <Atom size={18} />, label: 'Three.js', detail: '3D cell viewer' },
          { icon: <Bot size={18} />, label: 'Claude API', detail: 'AI lab partner' },
          { icon: <Microscope size={18} />, label: 'Recharts', detail: 'Data visualization' },
        ].map((tech, i) => (
          <div key={i} style={{
            background: 'white',
            border: '1.5px solid #e8e8e4',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#f0f0ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#444',
            }}>
              {tech.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{tech.label}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>{tech.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        padding: '20px 0',
        borderTop: '1px solid #e8e8e4',
        fontSize: '14px',
        color: '#999',
      }}>
        Built for <span style={{ color: '#4A6CF7', fontWeight: 700 }}>DSH Hacks V1</span> · AI × STEM Education
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/lab">
          <button className="btn-fill" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Start experimenting →
          </button>
        </Link>
      </div>
    </main>
  )
}
