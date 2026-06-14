export default function ProgressBadge({ experimentsRun, labsVisited }) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    }}>
      <div style={{
        background: '#f0f0ee',
        borderRadius: '99px',
        padding: '6px 14px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#444',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ fontSize: '14px' }}>🧪</span>
        {experimentsRun} experiment{experimentsRun !== 1 ? 's' : ''} run
      </div>
      <div style={{
        background: '#f0f0ee',
        borderRadius: '99px',
        padding: '6px 14px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#444',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ fontSize: '14px' }}>🔬</span>
        {labsVisited} lab{labsVisited !== 1 ? 's' : ''} visited
      </div>
    </div>
  )
}
