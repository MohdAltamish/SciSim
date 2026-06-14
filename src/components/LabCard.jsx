import { motion } from 'framer-motion'

export default function LabCard({ id, name, description, icon, tag, tagClass, active, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px 28px',
        border: active ? '1.5px solid #4A6CF7' : '1.5px solid #e8e8e4',
        cursor: 'pointer',
        transition: 'box-shadow 0.18s',
      }}
      className="hover:shadow-lg"
    >
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>{name}</h3>
      <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.55 }}>{description}</p>
      <span
        style={{
          display: 'inline-block',
          marginTop: '14px',
          fontSize: '12px',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '99px',
        }}
        className={tagClass}
      >
        {tag}
      </span>
    </motion.div>
  )
}
