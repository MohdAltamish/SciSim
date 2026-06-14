import { elements } from './experiments'

const categoryColors = {
  'nonmetal': '#4ECDC4',
  'noble-gas': '#9C27B0',
  'alkali-metal': '#FF5722',
  'alkaline-earth': '#FF9800',
  'metalloid': '#607D8B',
  'halogen': '#2196F3',
  'transition': '#FFC107',
  'post-transition': '#8BC34A',
}

export default function ElementPicker({ onSelect, selectedElements, targetBeaker }) {
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
        Adding to: Beaker {targetBeaker}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, 1fr)',
        gap: '3px',
        fontSize: '11px',
      }}>
        {elements.map((el) => {
          const isSelected = selectedElements.includes(el.symbol)
          return (
            <button
              key={el.symbol}
              onClick={() => onSelect(el.symbol)}
              title={`${el.name} (${el.number})`}
              style={{
                width: '100%',
                aspectRatio: '1',
                border: isSelected ? '2px solid #4A6CF7' : '1px solid #e8e8e4',
                borderRadius: '6px',
                background: isSelected
                  ? '#EEF2FF'
                  : `${categoryColors[el.category]}15`,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: '11px',
                color: isSelected ? '#4A6CF7' : '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.1s',
                position: 'relative',
              }}
            >
              {el.symbol}
            </button>
          )
        })}
      </div>
    </div>
  )
}
