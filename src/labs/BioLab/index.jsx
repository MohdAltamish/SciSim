import { useState, useEffect } from 'react'
import { useLab } from '../../context/LabContext'
import { specimens } from './specimens'
import MicroscopeView from './MicroscopeView'
import SpecimenPicker from './SpecimenPicker'
import { Eye, EyeOff, Info } from 'lucide-react'

export default function BioLab() {
  const { state, dispatch } = useLab()
  const [specimen, setSpecimen] = useState(null)
  const [selectedOrganelle, setSelectedOrganelle] = useState(null)
  const [showLabels, setShowLabels] = useState(true)

  useEffect(() => {
    const spec = specimens.find(s => s.id === state.activeExperiment)
    if (spec) {
      setSpecimen(spec)
      setSelectedOrganelle(null)
      dispatch({ type: 'INCREMENT_EXPERIMENTS' })
    }
  }, [state.activeExperiment])

  function handleOrganelleClick(organelleId) {
    if (!specimen) return
    const org = specimen.organelles.find(o => o.id === organelleId)
    if (org) {
      setSelectedOrganelle(org)
      dispatch({
        type: 'ADD_OBSERVATION',
        payload: `Examined ${org.name}: ${org.function}`,
      })
    }
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {/* 3D Viewer */}
      <div style={{ flex: 1 }}>
        <div className="sim-canvas-container" style={{ display: 'block', padding: 0, overflow: 'hidden' }}>
          <MicroscopeView
            specimen={specimen}
            onOrganelleClick={handleOrganelleClick}
            showLabels={showLabels}
          />
        </div>

        {/* Controls bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '10px',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '12px',
            }}
          >
            {showLabels ? <EyeOff size={14} /> : <Eye size={14} />}
            {showLabels ? 'Hide labels' : 'Show labels'}
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        width: '260px',
        flexShrink: 0,
      }}>
        {selectedOrganelle ? (
          <div style={{
            background: 'white',
            border: '1.5px solid #e8e8e4',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `${selectedOrganelle.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: selectedOrganelle.color,
              }} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>
              {selectedOrganelle.name}
            </h3>

            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#999',
                marginBottom: '4px',
              }}>
                Function
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#444' }}>
                {selectedOrganelle.function}
              </p>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#999',
                marginBottom: '4px',
              }}>
                Size
              </div>
              <p style={{ fontSize: '13px', color: '#444' }}>
                {selectedOrganelle.size}
              </p>
            </div>

            <div style={{
              background: '#f9f9f7',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '8px',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#4A6CF7',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Info size={12} /> Fun fact
              </div>
              <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#555' }}>
                {selectedOrganelle.funFact}
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'white',
            border: '1.5px solid #e8e8e4',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.3 }}>🔬</div>
            <p style={{ fontSize: '13px', color: '#999', lineHeight: 1.5 }}>
              Click on an organelle in the 3D view to learn about it
            </p>
          </div>
        )}

        {/* Organelle list */}
        {specimen && (
          <div style={{
            marginTop: '12px',
            background: 'white',
            border: '1.5px solid #e8e8e4',
            borderRadius: '12px',
            padding: '12px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#999',
              marginBottom: '8px',
            }}>
              Structures
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {specimen.organelles.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrganelleClick(org.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    border: 'none',
                    background: selectedOrganelle?.id === org.id ? `${org.color}15` : 'transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#333',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: org.color,
                    flexShrink: 0,
                  }} />
                  {org.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
