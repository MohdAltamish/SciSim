import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, X, Loader2 } from 'lucide-react'
import { useLab } from '../context/LabContext'
import { askAIPartner } from '../services/claudeApi'

function parseInlineMarkdown(text) {
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} style={{ fontWeight: 'bold', color: 'white' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function parseMarkdownToReact(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let currentListType = null;

  const pushCurrentList = (key) => {
    if (currentList.length > 0) {
      if (currentListType === 'ul') {
        elements.push(
          <ul key={`ul-${key}`} style={{ paddingLeft: '20px', margin: '4px 0 8px 0', listStyleType: 'disc' }}>
            {currentList}
          </ul>
        );
      } else if (currentListType === 'ol') {
        elements.push(
          <ol key={`ol-${key}`} style={{ paddingLeft: '20px', margin: '4px 0 8px 0', listStyleType: 'decimal' }}>
            {currentList}
          </ol>
        );
      }
      currentList = [];
      currentListType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (currentListType !== 'ul') {
        pushCurrentList(index);
        currentListType = 'ul';
      }
      const content = trimmed.substring(2);
      currentList.push(<li key={index} style={{ marginBottom: '4px', listStylePosition: 'outside' }}>{parseInlineMarkdown(content)}</li>);
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (currentListType !== 'ol') {
        pushCurrentList(index);
        currentListType = 'ol';
      }
      const content = numMatch[2];
      currentList.push(<li key={index} style={{ marginBottom: '4px', listStylePosition: 'outside' }}>{parseInlineMarkdown(content)}</li>);
      return;
    }

    pushCurrentList(index);

    if (trimmed === '') {
      elements.push(<div key={`br-${index}`} style={{ height: '8px' }} />);
    } else {
      elements.push(
        <p key={index} style={{ margin: '0 0 8px 0' }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  });

  pushCurrentList('end');
  return elements;
}

export default function AIPartnerBar() {
  const { state, dispatch } = useLab()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [state.conversationHistory])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    dispatch({ type: 'ADD_MESSAGE', payload: { role: 'user', content: userMessage } })
    dispatch({ type: 'SET_AI_PANEL', payload: true })

    try {
      const response = await askAIPartner({
        userMessage,
        labContext: {
          lab: state.activeLab || 'general',
          experiment: state.activeExperiment || 'none',
          variables: state.variables,
          observations: state.observations.slice(-5).join('; '),
        },
        conversationHistory: state.conversationHistory,
      })

      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: response } })
    } catch (err) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: "Sorry, I couldn't process that. Please try again!" },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: 'sticky',
          bottom: 0,
          background: 'white',
          borderTop: '1.5px solid #e8e8e4',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        <Sparkles size={20} color="#4A6CF7" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI lab partner anything…"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            background: 'transparent',
            color: '#111',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-fill"
          style={{
            padding: '8px 18px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : null}
          Ask →
        </button>
        {state.conversationHistory.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_AI_PANEL' })}
            style={{
              background: 'none',
              border: '1.5px solid #e8e8e4',
              borderRadius: '99px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#444',
              fontFamily: 'inherit',
            }}
          >
            {state.aiPanelOpen ? 'Hide' : 'Chat'} ({state.conversationHistory.length})
          </button>
        )}
      </form>

      {/* Side panel */}
      <AnimatePresence>
        {state.aiPanelOpen && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '340px',
              background: '#111',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
            }}
          >
            {/* Panel header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #2a2a2a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#4A6CF7" />
                <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>AI Lab Partner</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_AI_PANEL', payload: false })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {state.conversationHistory.map((msg, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: '11px',
                    color: '#555',
                    marginBottom: '4px',
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}>
                    {msg.role === 'user' ? 'You' : 'SciSim AI'}
                  </div>
                  <div style={{
                    borderRadius: '14px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    maxWidth: '90%',
                    marginLeft: msg.role === 'user' ? 'auto' : 0,
                    background: msg.role === 'user' ? '#4A6CF7' : '#2a2a2a',
                    color: msg.role === 'user' ? 'white' : '#ddd',
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}>
                    {msg.role === 'assistant' ? parseMarkdownToReact(msg.content) : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#666',
                  fontSize: '13px',
                  padding: '10px',
                }}>
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
