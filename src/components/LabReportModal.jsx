import { motion } from 'framer-motion'
import { X, Printer, AlertTriangle } from 'lucide-react'

export default function LabReportModal({ report, onClose }) {
  if (!report) return null

  function handlePrint() {
    window.print()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="lab-report-print"
        style={{
          background: 'white',
          borderRadius: '20px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '40px',
        }}
      >
        {/* Header */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Lab Report</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
            >
              <Printer size={14} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1.5px solid #e8e8e4',
                borderRadius: '99px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div style={{
          background: '#f9f9f7',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{report.title}</h3>
          <p style={{ fontSize: '13px', color: '#666' }}>{report.date}</p>
        </div>

        {/* Sections */}
        <ReportSection title="Objective" content={report.objective} />
        <ReportSection title="Hypothesis" content={report.hypothesis} />

        {/* Materials */}
        {report.materials && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginBottom: '8px' }}>
              Materials
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {report.materials.map((m, i) => (
                <span key={i} style={{
                  background: '#f0f0ee',
                  borderRadius: '99px',
                  padding: '4px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Procedure */}
        {report.procedure && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999', marginBottom: '8px' }}>
              Procedure
            </h4>
            <ol style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7, color: '#333' }}>
              {report.procedure.map((step, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {step.replace(/^\d+\.\s*/, '')}
                </li>
              ))}
            </ol>
          </div>
        )}

        <ReportSection title="Observations" content={report.observations} />
        <ReportSection title="Results" content={report.results} />
        <ReportSection title="Analysis" content={report.analysis} />
        <ReportSection title="Conclusion" content={report.conclusion} />

        {/* Safety */}
        {report.safetyNotes && (
          <div style={{
            background: '#FFF3CD',
            borderRadius: '12px',
            padding: '16px 20px',
            marginTop: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <AlertTriangle size={18} color="#7a5500" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#7a5500', marginBottom: '4px' }}>
                Safety notes
              </h4>
              <p style={{ fontSize: '13px', color: '#7a5500', lineHeight: 1.5 }}>
                {report.safetyNotes}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function ReportSection({ title, content }) {
  if (!content) return null
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{
        fontSize: '13px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#999',
        marginBottom: '6px',
      }}>
        {title}
      </h4>
      <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#333' }}>
        {content}
      </p>
    </div>
  )
}
