export default function ControlPanel({ experiment, variables, onVariableChange }) {
  if (!experiment) return null

  const varDefs = experiment.variables

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #e8e8e4',
      borderRadius: '12px',
      padding: '20px',
      width: '220px',
      flexShrink: 0,
    }}>
      <h3 style={{
        fontSize: '13px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#999',
        marginBottom: '16px',
      }}>
        Controls
      </h3>

      {Object.entries(varDefs).map(([key, def]) => {
        const value = variables[key] ?? def.default
        return (
          <div key={key} style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>
                {def.label}
              </label>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#4A6CF7' }}>
                {typeof value === 'number' ? value.toFixed(def.step < 1 ? 1 : 0) : value}{def.unit}
              </span>
            </div>
            <input
              type="range"
              min={def.min}
              max={def.max}
              step={def.step}
              value={value}
              onChange={(e) => onVariableChange(key, parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#bbb',
              marginTop: '2px',
            }}>
              <span>{def.min}{def.unit}</span>
              <span>{def.max}{def.unit}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
