import { useLab } from '../context/LabContext'
import ChemLab from '../labs/ChemLab'
import PhysicsLab from '../labs/PhysicsLab'
import BioLab from '../labs/BioLab'
import { FlaskConical, Atom, Microscope } from 'lucide-react'

export default function SimWorkspace() {
  const { state } = useLab()

  if (!state.activeLab || !state.activeExperiment) {
    return (
      <div className="sim-canvas-container" style={{ minHeight: '420px', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '48px', opacity: 0.3 }}>
          {state.activeLab === 'chem' ? '⚗️' : state.activeLab === 'physics' ? '⚡' : state.activeLab === 'bio' ? '🔬' : '🧪'}
        </div>
        <p style={{ color: '#999', fontSize: '15px', fontWeight: 500 }}>
          {state.activeLab ? 'Select an experiment to begin' : 'Select a lab to begin'}
        </p>
      </div>
    )
  }

  switch (state.activeLab) {
    case 'chem':
      return <ChemLab />
    case 'physics':
      return <PhysicsLab />
    case 'bio':
      return <BioLab />
    default:
      return null
  }
}
