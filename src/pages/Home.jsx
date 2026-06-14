import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LabCard from '../components/LabCard'

const labCards = [
  {
    id: 'chem',
    name: 'Chem Lab',
    description: 'Mix virtual chemicals and watch AI predict reactions, byproducts, and safety warnings in real time.',
    icon: '⚗️',
    tag: 'Chemistry',
    tagClass: 'bg-chem-bg text-chem-text',
  },
  {
    id: 'physics',
    name: 'Physics Lab',
    description: 'Adjust forces, mass, and velocity — or upload a real video and let AI annotate the physics for you.',
    icon: '⚡',
    tag: 'Physics',
    tagClass: 'bg-phys-bg text-phys-text',
  },
  {
    id: 'bio',
    name: 'Bio Lab',
    description: 'Explore cell structures and virtual dissections with an AI guide that adapts to your level.',
    icon: '🔬',
    tag: 'Biology',
    tagClass: 'bg-bio-bg text-bio-text',
  },
  {
    id: 'ai',
    name: 'AI Lab Partner',
    description: 'Ask anything, get explanations, generate lab reports — your personal science tutor across every module.',
    icon: '🤖',
    tag: 'Powered by AI',
    tagClass: 'bg-ai-bg text-ai-text',
  },
]

const shapes = [
  { className: 's1', style: { width: 100, height: 100, background: '#c8f5c8', borderRadius: '50%', top: 80, left: '6%' }, duration: 7 },
  { className: 's2', style: { width: 70, height: 70, background: '#ffd6c0', borderRadius: 18, top: 60, right: '8%' }, duration: 8 },
  { className: 's3', style: { width: 130, height: 130, background: '#d4e0ff', borderRadius: '50%', bottom: 60, left: '3%' }, duration: 9 },
  { className: 's4', style: { width: 80, height: 80, background: '#c8f5c8', borderRadius: 20, bottom: 80, right: '5%' }, duration: 6 },
  { className: 's5', style: { width: 50, height: 50, background: '#ffd6c0', borderRadius: '50%', top: 200, left: '18%' }, duration: 10 },
  { className: 's6', style: { width: 60, height: 60, background: '#d4e0ff', borderRadius: 14, top: 160, right: '16%' }, duration: 7.5 },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <main>
      {/* Hero */}
      <section style={{
        position: 'relative',
        textAlign: 'center',
        padding: '100px 48px 80px',
        overflow: 'hidden',
        minHeight: '520px',
      }}>
        {/* Floating shapes */}
        {shapes.map((shape, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            style={{
              position: 'absolute',
              opacity: 0.55,
              pointerEvents: 'none',
              ...shape.style,
            }}
          />
        ))}

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
          marginBottom: '24px',
        }}>
          AI × STEM EDUCATION
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-2px',
          maxWidth: '720px',
          margin: '0 auto 20px',
        }}>
          Your virtual<br />
          <span style={{ color: '#4A6CF7' }}>science lab.</span><br />
          Powered by AI.
        </h1>

        <p style={{
          fontSize: '17px',
          color: '#555',
          maxWidth: '480px',
          margin: '0 auto 36px',
          lineHeight: 1.6,
        }}>
          Run chemistry reactions, physics simulations, and biology experiments — no equipment needed.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-fill"
            style={{ padding: '14px 32px', fontSize: '16px' }}
            onClick={() => navigate('/lab')}
          >
            Start experimenting →
          </button>
          <button
            className="btn-outline"
            style={{ padding: '13px 30px', fontSize: '16px' }}
            onClick={() => {
              document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            See how it works
          </button>
        </div>
      </section>

      {/* Module Cards */}
      <section id="modules" style={{ padding: '60px 48px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '12px',
          letterSpacing: '-0.5px',
        }}>
          Pick your lab
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '15px', marginBottom: '40px' }}>
          Three subject modules, one AI brain, zero barriers.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {labCards.map((card) => (
            <LabCard
              key={card.id}
              {...card}
              onClick={() => {
                if (card.id !== 'ai') {
                  navigate(`/lab?module=${card.id}`)
                } else {
                  navigate('/lab')
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* AI Partner Strip */}
      <div style={{
        margin: '20px 48px 60px',
        background: '#111',
        borderRadius: '28px',
        padding: '40px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
            Ask your AI Lab Partner anything.
          </h3>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6 }}>
            Real-time explanations, adaptive quizzes, and auto-generated lab reports — always by your side.
          </p>
        </div>
        <div style={{
          flex: 1,
          minWidth: '260px',
          background: '#1e1e1e',
          borderRadius: '18px',
          padding: '20px 22px',
        }}>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>You</div>
          <div style={{
            borderRadius: '14px',
            padding: '10px 14px',
            fontSize: '13px',
            lineHeight: 1.5,
            marginBottom: '10px',
            maxWidth: '90%',
            background: '#4A6CF7',
            color: 'white',
            marginLeft: 'auto',
            textAlign: 'right',
          }}>
            Why did the reaction turn blue?
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px', marginTop: '10px' }}>SciSim AI</div>
          <div style={{
            borderRadius: '14px',
            padding: '10px 14px',
            fontSize: '13px',
            lineHeight: 1.5,
            maxWidth: '90%',
            background: '#2a2a2a',
            color: '#ddd',
          }}>
            That blue color is from the iodine-starch complex forming. It means starch molecules are present in the solution — a classic indicator reaction! Want me to explain the mechanism?
          </div>
        </div>
      </div>
    </main>
  )
}
