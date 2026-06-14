import { useState, useEffect } from 'react'
import { useLab } from '../../context/LabContext'
import { experiments } from './experiments'
import SimCanvas from './SimCanvas'
import ControlPanel from './ControlPanel'

export default function PhysicsLab() {
  const { state, dispatch } = useLab()
  const experiment = experiments.find(e => e.id === state.activeExperiment)
  const [localVars, setLocalVars] = useState({})

  useEffect(() => {
    if (experiment) {
      const defaults = {}
      Object.entries(experiment.variables).forEach(([key, def]) => {
        defaults[key] = def.default
      })
      setLocalVars(defaults)
      dispatch({ type: 'SET_VARIABLES', payload: defaults })
      dispatch({ type: 'INCREMENT_EXPERIMENTS' })
    }
  }, [experiment?.id])

  function handleVariableChange(key, value) {
    setLocalVars(prev => ({ ...prev, [key]: value }))
    dispatch({ type: 'SET_VARIABLES', payload: { [key]: value } })
    dispatch({
      type: 'ADD_OBSERVATION',
      payload: `Changed ${key} to ${value}`,
    })
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {/* Control Panel */}
      <ControlPanel
        experiment={experiment}
        variables={localVars}
        onVariableChange={handleVariableChange}
      />

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <div className="sim-canvas-container" style={{ display: 'block', padding: 0 }}>
          <SimCanvas
            experimentId={state.activeExperiment}
            variables={localVars}
          />
        </div>
      </div>
    </div>
  )
}
