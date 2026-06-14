import { createContext, useContext, useReducer, useEffect } from 'react'

const LabContext = createContext(null)

const initialProgress = {
  experimentsRun: 0,
  labsVisited: [],
  totalTime: 0,
}

function loadProgress() {
  try {
    const saved = localStorage.getItem('scisim-progress')
    return saved ? JSON.parse(saved) : initialProgress
  } catch {
    return initialProgress
  }
}

const initialState = {
  activeLab: null,
  activeExperiment: null,
  variables: {},
  observations: [],
  conversationHistory: [],
  progress: loadProgress(),
  aiPanelOpen: false,
}

function labReducer(state, action) {
  switch (action.type) {
    case 'SET_LAB':
      return {
        ...state,
        activeLab: action.payload,
        activeExperiment: null,
        variables: {},
        observations: [],
        conversationHistory: [],
        progress: {
          ...state.progress,
          labsVisited: state.progress.labsVisited.includes(action.payload)
            ? state.progress.labsVisited
            : [...state.progress.labsVisited, action.payload],
        },
      }
    case 'SET_EXPERIMENT':
      return {
        ...state,
        activeExperiment: action.payload.id,
        variables: action.payload.variables || {},
        observations: [],
      }
    case 'SET_VARIABLES':
      return { ...state, variables: { ...state.variables, ...action.payload } }
    case 'ADD_OBSERVATION':
      return { ...state, observations: [...state.observations, action.payload] }
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, action.payload],
      }
    case 'CLEAR_CONVERSATION':
      return { ...state, conversationHistory: [] }
    case 'INCREMENT_EXPERIMENTS':
      return {
        ...state,
        progress: {
          ...state.progress,
          experimentsRun: state.progress.experimentsRun + 1,
        },
      }
    case 'SET_AI_PANEL':
      return { ...state, aiPanelOpen: action.payload }
    case 'TOGGLE_AI_PANEL':
      return { ...state, aiPanelOpen: !state.aiPanelOpen }
    default:
      return state
  }
}

export function LabProvider({ children }) {
  const [state, dispatch] = useReducer(labReducer, initialState)

  useEffect(() => {
    localStorage.setItem('scisim-progress', JSON.stringify(state.progress))
  }, [state.progress])

  return (
    <LabContext.Provider value={{ state, dispatch }}>
      {children}
    </LabContext.Provider>
  )
}

export function useLab() {
  const context = useContext(LabContext)
  if (!context) {
    throw new Error('useLab must be used within a LabProvider')
  }
  return context
}

export default LabContext
