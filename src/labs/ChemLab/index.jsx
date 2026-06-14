import { useState } from 'react'
import { useLab } from '../../context/LabContext'
import { reactions } from './experiments'
import ReactionCanvas from './ReactionCanvas'
import ElementPicker from './ElementPicker'
import { AlertTriangle, Play } from 'lucide-react'

export default function ChemLab() {
  const { state, dispatch } = useLab()
  const [selectedElements, setSelectedElements] = useState([])
  const [targetBeaker, setTargetBeaker] = useState('A')
  const [isReacting, setIsReacting] = useState(false)
  const [showSafety, setShowSafety] = useState(false)

  const currentReaction = reactions.find(r => r.id === state.activeExperiment)

  function handleElementSelect(symbol) {
    if (selectedElements.includes(symbol)) {
      setSelectedElements(selectedElements.filter(s => s !== symbol))
    } else {
      setSelectedElements([...selectedElements, symbol])
    }
  }

  function handleMix() {
    if (!currentReaction) return
    setIsReacting(true)
    setShowSafety(true)
    dispatch({ type: 'ADD_OBSERVATION', payload: `Mixed ${currentReaction.reactants.join(' + ')} → ${currentReaction.products.join(' + ')}` })
    dispatch({ type: 'INCREMENT_EXPERIMENTS' })
  }

  function handleReactionComplete() {
    dispatch({
      type: 'ADD_OBSERVATION',
      payload: `Reaction complete: ${currentReaction.description}`,
    })
  }

  return (
    <div>
      {/* Canvas */}
      <div className="sim-canvas-container" style={{ minHeight: '420px', display: 'block', padding: '0' }}>
        <ReactionCanvas
          reaction={currentReaction}
          isReacting={isReacting}
          onReactionComplete={handleReactionComplete}
        />
      </div>

      {/* Safety banner */}
      {showSafety && currentReaction?.safety && (
        <div style={{
          background: '#FFF3CD',
          borderRadius: '12px',
          padding: '12px 16px',
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          color: '#7a5500',
        }}>
          <AlertTriangle size={16} />
          <span><strong>Safety:</strong> {currentReaction.safety}</span>
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginTop: '16px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Element Picker */}
        <div style={{
          flex: '1',
          minWidth: '280px',
          background: 'white',
          borderRadius: '12px',
          border: '1.5px solid #e8e8e4',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <button
              onClick={() => setTargetBeaker('A')}
              style={{
                padding: '6px 16px',
                borderRadius: '99px',
                border: targetBeaker === 'A' ? '1.5px solid #4A6CF7' : '1.5px solid #e8e8e4',
                background: targetBeaker === 'A' ? '#EEF2FF' : 'white',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Beaker A
            </button>
            <button
              onClick={() => setTargetBeaker('B')}
              style={{
                padding: '6px 16px',
                borderRadius: '99px',
                border: targetBeaker === 'B' ? '1.5px solid #4A6CF7' : '1.5px solid #e8e8e4',
                background: targetBeaker === 'B' ? '#EEF2FF' : 'white',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Beaker B
            </button>
          </div>
          <ElementPicker
            onSelect={handleElementSelect}
            selectedElements={selectedElements}
            targetBeaker={targetBeaker}
          />
        </div>

        {/* Mix button + info */}
        <div style={{
          minWidth: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <button
            onClick={handleMix}
            disabled={!currentReaction || isReacting}
            className="btn-fill"
            style={{
              padding: '14px 28px',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Play size={16} />
            {isReacting ? 'Reacting...' : 'Mix!'}
          </button>

          <button
            onClick={() => {
              setIsReacting(false)
              setShowSafety(false)
              setSelectedElements([])
            }}
            className="btn-outline"
            style={{ width: '100%' }}
          >
            Reset
          </button>

          {currentReaction && (
            <div style={{
              background: '#f9f9f7',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#555',
            }}>
              <div style={{ fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                {currentReaction.name}
              </div>
              {currentReaction.description}
              {currentReaction.phChange && (
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  <strong>pH:</strong> {currentReaction.phChange.before.join(' / ')} → {currentReaction.phChange.after}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
