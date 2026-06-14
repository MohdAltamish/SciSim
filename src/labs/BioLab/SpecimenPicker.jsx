import { specimens } from './specimens'

export default function SpecimenPicker({ activeSpecimen, onSelect }) {
  return (
    <div>
      <div style={{
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#999',
        marginBottom: '10px',
      }}>
        Specimens
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {specimens.map((spec) => (
          <button
            key={spec.id}
            onClick={() => onSelect(spec)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background: activeSpecimen === spec.id ? '#EEF2FF' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'background 0.15s',
              borderLeft: activeSpecimen === spec.id ? '3px solid #4A6CF7' : '3px solid transparent',
            }}
          >
            <span style={{ fontSize: '20px' }}>
              {spec.type === 'animal' ? '🦠' : spec.type === 'plant' ? '🌿' : '🔬'}
            </span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>
                {spec.name}
              </div>
              <div style={{ fontSize: '11px', color: '#999' }}>
                {spec.organelles.length} structures
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
