import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FlaskConical, Atom, Microscope, Sparkles, FileText, Clock, Beaker, Plus } from 'lucide-react'
import { useLab } from '../context/LabContext'
import SimWorkspace from '../components/SimWorkspace'
import AIPartnerBar from '../components/AIPartnerBar'
import LabReportModal from '../components/LabReportModal'
import ProgressBadge from '../components/ProgressBadge'
import { generateLabReport, textToExperiment } from '../services/claudeApi'
import { reactions } from '../labs/ChemLab/experiments'
import { experiments as physicsExperiments } from '../labs/PhysicsLab/experiments'
import { specimens } from '../labs/BioLab/specimens'

const labs = {
  chem: {
    name: 'Chemistry Lab',
    icon: '⚗️',
    color: '#7a5500',
    bg: '#fff3cd',
    experiments: reactions.map(r => ({ id: r.id, name: r.name, description: r.description })),
  },
  physics: {
    name: 'Physics Lab',
    icon: '⚡',
    color: '#1a3a8f',
    bg: '#dce8ff',
    experiments: physicsExperiments.map(e => ({ id: e.id, name: e.name, description: e.description })),
  },
  bio: {
    name: 'Biology Lab',
    icon: '🔬',
    color: '#0e5c30',
    bg: '#d4f7e0',
    experiments: specimens.map(s => ({ id: s.id, name: s.name, description: s.description })),
  },
}

export default function LabPage() {
  const { state, dispatch } = useLab()
  const [searchParams] = useSearchParams()
  const [report, setReport] = useState(null)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [generatingCustom, setGeneratingCustom] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  // Handle ?module= query param
  useEffect(() => {
    const module = searchParams.get('module')
    if (module && labs[module] && state.activeLab !== module) {
      dispatch({ type: 'SET_LAB', payload: module })
    }
  }, [searchParams])

  const currentLab = state.activeLab ? labs[state.activeLab] : null

  async function handleGenerateReport() {
    setGeneratingReport(true)
    try {
      const result = await generateLabReport({
        lab: state.activeLab,
        experiment: state.activeExperiment,
        conversationHistory: state.conversationHistory,
        variables: state.variables,
      })
      if (result) {
        setReport(result)
      } else {
        showToast('Report generation returned empty. Try running an experiment first.')
      }
    } catch (err) {
      console.error('Report generation failed:', err)
      if (err.message === 'RATE_LIMITED') {
        showToast('⏳ Rate limit reached — please wait a minute and try again.')
      } else {
        showToast('Failed to generate report. Please try again.')
      }
    } finally {
      setGeneratingReport(false)
    }
  }

  async function handleCustomExperiment() {
    if (!customInput.trim() || !state.activeLab) return
    setGeneratingCustom(true)
    try {
      const result = await textToExperiment({
        description: customInput.trim(),
        lab: state.activeLab,
      })
      if (result) {
        dispatch({
          type: 'SET_EXPERIMENT',
          payload: { id: result.type, variables: result.variables },
        })
        dispatch({
          type: 'ADD_OBSERVATION',
          payload: `Custom experiment: ${result.name} — ${result.objective}`,
        })
        setCustomInput('')
        setShowCustom(false)
        showToast(`✅ Custom experiment "${result.name}" loaded!`, 'success')
      } else {
        showToast('Could not map your experiment. Try a different description.')
      }
    } catch (err) {
      console.error('Custom experiment failed:', err)
      if (err.message === 'RATE_LIMITED') {
        showToast('⏳ Rate limit reached — please wait a minute and try again.')
      } else {
        showToast('Failed to generate experiment. Please try again.')
      }
    } finally {
      setGeneratingCustom(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        borderRight: '1.5px solid #e8e8e4',
        background: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        flexShrink: 0,
        overflowY: 'auto',
      }}>
        {/* Lab Selector */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#999',
            marginBottom: '10px',
          }}>
            Choose lab
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Object.entries(labs).map(([key, lab]) => (
              <button
                key={key}
                onClick={() => dispatch({ type: 'SET_LAB', payload: key })}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  border: state.activeLab === key ? '1.5px solid #4A6CF7' : '1.5px solid #e8e8e4',
                  borderRadius: '10px',
                  background: state.activeLab === key ? '#EEF2FF' : 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{lab.icon}</div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: state.activeLab === key ? '#4A6CF7' : '#666',
                }}>
                  {key === 'chem' ? 'Chem' : key === 'physics' ? 'Physics' : 'Bio'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Experiments list */}
        {currentLab && (
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#999',
              marginBottom: '10px',
            }}>
              Experiments
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {currentLab.experiments.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => dispatch({
                    type: 'SET_EXPERIMENT',
                    payload: { id: exp.id },
                  })}
                  style={{
                    padding: '10px 12px',
                    border: 'none',
                    borderLeft: state.activeExperiment === exp.id
                      ? '3px solid #4A6CF7'
                      : '3px solid transparent',
                    background: state.activeExperiment === exp.id ? '#EEF2FF' : 'transparent',
                    borderRadius: '0 8px 8px 0',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    fontSize: '13px',
                    fontWeight: state.activeExperiment === exp.id ? 600 : 400,
                    color: '#111',
                  }}>
                    {exp.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#999',
                    marginTop: '2px',
                    lineHeight: 1.4,
                  }}>
                    {exp.description.slice(0, 60)}…
                  </div>
                </button>
              ))}
            </div>

            {/* Custom experiment */}
            <button
              onClick={() => setShowCustom(!showCustom)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 12px',
                border: '1.5px dashed #e8e8e4',
                borderRadius: '8px',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '12px',
                fontWeight: 500,
                color: '#666',
                width: '100%',
                marginTop: '8px',
              }}
            >
              <Plus size={14} />
              Custom experiment
            </button>

            {showCustom && (
              <div style={{ marginTop: '8px' }}>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Describe your experiment…"
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomExperiment()}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1.5px solid #e8e8e4',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleCustomExperiment}
                  disabled={generatingCustom || !customInput.trim()}
                  className="btn-fill"
                  style={{ width: '100%', marginTop: '6px', fontSize: '12px', padding: '6px', opacity: generatingCustom ? 0.7 : 1 }}
                >
                  {generatingCustom ? 'Generating…' : 'Generate →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Session stats */}
        <div style={{ marginTop: 'auto' }}>
          <ProgressBadge
            experimentsRun={state.progress.experimentsRun}
            labsVisited={state.progress.labsVisited.length}
          />

          <button
            onClick={handleGenerateReport}
            disabled={generatingReport || !state.activeExperiment}
            className="btn-outline"
            style={{
              width: '100%',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '13px',
            }}
          >
            <FileText size={14} />
            {generatingReport ? 'Generating…' : 'Generate report'}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Top bar */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1.5px solid #e8e8e4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentLab && (
              <>
                <span style={{ fontSize: '20px' }}>{currentLab.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{currentLab.name}</span>
              </>
            )}
            {state.activeExperiment && (
              <>
                <span style={{ color: '#ccc' }}>·</span>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {currentLab?.experiments.find(e => e.id === state.activeExperiment)?.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Simulation area */}
        <div style={{
          flex: 1,
          padding: '20px 24px',
          overflowY: 'auto',
          paddingBottom: '80px',
        }}>
          <SimWorkspace />
        </div>

        {/* AI Bar */}
        <AIPartnerBar />
      </div>

      {/* Lab Report Modal */}
      <AnimatePresence>
        {report && (
          <LabReportModal
            report={report}
            onClose={() => setReport(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            onClick={() => setToast(null)}
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: toast.type === 'success' ? '#0e5c30' : '#7a2020',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
              zIndex: 400,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
