import { GoogleGenAI } from '@google/genai'

const MODEL_NAME = 'gemini-2.5-flash'
const MAX_RETRIES = 3
const BASE_DELAY_MS = 2000

function getClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
  return new GoogleGenAI({ apiKey })
}

async function withRetry(fn, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const is429 = error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('RESOURCE_EXHAUSTED') ||
        error?.message?.includes('quota')

      if (is429 && attempt < retries) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt)
        console.warn(`Rate limited (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
}

function isApiKeySet() {
  const key = import.meta.env.VITE_GEMINI_API_KEY || ''
  return key && key !== 'your_key_here' && key.length > 10
}

// Mock responses for when API key isn't configured
const mockResponses = {
  default: "I'm your AI lab partner! It looks like the API key isn't configured yet. Add your Google Gemini API key to the .env file as VITE_GEMINI_API_KEY to enable real AI responses. You can get a free key at https://aistudio.google.com/apikey",
  chem: "Great question about this chemical reaction! The molecules are interacting based on their electron configurations and bond energies. In a real lab, you'd observe similar color changes and gas production. Try adjusting the reactants to see different outcomes!",
  physics: "Interesting observation! The physics behind this simulation follows Newton's laws of motion. The key variables — mass, velocity, and force — all interact according to well-established equations. Try changing the parameters to see how the system responds!",
  bio: "Fascinating! The organelle you're looking at plays a crucial role in cellular function. Each component of the cell works together like a miniature factory, processing energy, building proteins, and maintaining the cell's structure. Click on different parts to learn more!",
}

export async function askAIPartner({ userMessage, labContext, conversationHistory }) {
  if (!isApiKeySet()) {
    const labType = labContext?.lab || 'default'
    return mockResponses[labType] || mockResponses.default
  }

  const systemPrompt = `You are SciSim's AI Lab Partner — a friendly, knowledgeable science tutor for students aged 13+.

Current lab context:
- Active lab: ${labContext.lab} (${labContext.experiment})
- Current variables: ${JSON.stringify(labContext.variables)}
- Recent observations: ${labContext.observations}

Your role:
1. Explain what is happening in the current simulation in clear, engaging terms
2. Answer student questions about the science behind what they see
3. Suggest what to try next to deepen their understanding
4. Point out real-world applications of the concept
5. If asked about safety (especially in chem lab), give accurate safety information

Tone: Enthusiastic but precise. Like a great science teacher, not a textbook.
Format: Short paragraphs, no bullet lists unless listing steps. Max 150 words per response unless a detailed explanation is truly needed.`

  try {
    return await withRetry(async () => {
      const ai = getClient()

      // Build history from conversation (exclude last user message)
      const history = conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))

      const chat = ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
        history,
      })

      const response = await chat.sendMessage({ message: userMessage })
      return response.text || "I couldn't generate a response. Try again!"
    })
  } catch (error) {
    console.error('AI Partner error:', error)
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      return "⏳ I've hit my rate limit — too many requests in a short time. Please wait a minute and try again!"
    }
    return "I'm having trouble connecting right now. Please check your API key and try again!"
  }
}

function safeJsonParse(text) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (e) {
    const startIdx = text.indexOf('{')
    const endIdx = text.lastIndexOf('}')
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      try {
        const extracted = text.substring(startIdx, endIdx + 1)
        return JSON.parse(extracted)
      } catch (innerError) {
        console.error('Failed to parse extracted JSON:', innerError)
      }
    }
    throw e
  }
}

export async function generateLabReport({ lab, experiment, conversationHistory, variables }) {
  if (!isApiKeySet()) {
    return {
      title: `${experiment || 'Experiment'} — Lab Report`,
      date: new Date().toLocaleDateString(),
      objective: 'To observe and analyze the results of the simulation experiment.',
      hypothesis: 'The experiment will demonstrate fundamental scientific principles as predicted by theory.',
      materials: ['Virtual simulation environment', 'SciSim AI platform', 'AI Lab Partner'],
      procedure: ['1. Selected the experiment from the lab menu', '2. Configured initial parameters', '3. Ran the simulation and observed results', '4. Discussed findings with AI Lab Partner'],
      observations: 'The simulation demonstrated the expected behavior based on scientific principles. Key interactions were observed and analyzed.',
      results: 'Results were consistent with theoretical predictions. Variables responded as expected when modified.',
      analysis: 'The simulation successfully demonstrated the underlying scientific concepts. The relationships between variables followed established scientific laws.',
      conclusion: 'The experiment achieved its objective, demonstrating key scientific principles through interactive simulation.',
      safetyNotes: lab === 'chem' ? 'In a real lab: always wear appropriate PPE including goggles and gloves.' : null,
    }
  }

  const prompt = `Generate a structured lab report for the following session:

Lab: ${lab}
Experiment: ${experiment}
Variables used: ${JSON.stringify(variables)}
Conversation log: ${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

Return a JSON object with these fields:
{
  "title": string,
  "date": string (today),
  "objective": string (1-2 sentences),
  "hypothesis": string (1-2 sentences),
  "materials": string[] (list of simulated materials/tools used),
  "procedure": string[] (steps the student likely followed),
  "observations": string (2-3 sentences summarizing what happened),
  "results": string (what was measured or observed, with values),
  "analysis": string (2-3 sentences explaining the science),
  "conclusion": string (1-2 sentences),
  "safetyNotes": string (relevant safety information, or null if not applicable)
}

Return ONLY the JSON object, no markdown backticks.`

  try {
    return await withRetry(async () => {
      const ai = getClient()
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: 'You are a helpful lab report generator.',
          responseMimeType: 'application/json',
          maxOutputTokens: 1000,
        },
      })

      return safeJsonParse(response.text)
    })
  } catch (error) {
    console.error('Lab report error:', error)
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      throw new Error('RATE_LIMITED')
    }
    throw new Error('REPORT_FAILED')
  }
}

export async function textToExperiment({ description, lab }) {
  if (!isApiKeySet()) {
    return {
      name: 'Custom Experiment',
      type: lab === 'chem' ? 'acid-base' : lab === 'physics' ? 'pendulum' : 'cell',
      variables: {},
      objective: `Explore: ${description}`,
      hint: 'Try adjusting the parameters to see different outcomes!',
    }
  }

  const prompt = `A student wants to run this custom experiment in the ${lab} lab: "${description}"

Map this to a simulation configuration. Return a JSON object:
{
  "name": string (short experiment name),
  "type": string (which preset type this maps to: "acid-base" | "combustion" | "electrolysis" | "pendulum" | "projectile" | "waves" | "cell"),
  "variables": { key: value } (suggested starting values for sliders),
  "objective": string (what the student will observe),
  "hint": string (one tip to help them explore further)
}

Return ONLY the JSON object.`

  try {
    return await withRetry(async () => {
      const ai = getClient()
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: 'You are a helpful science experiment mapper.',
          responseMimeType: 'application/json',
          maxOutputTokens: 1000,
        },
      })

      return safeJsonParse(response.text)
    })
  } catch (error) {
    console.error('Text-to-experiment error:', error)
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      throw new Error('RATE_LIMITED')
    }
    throw new Error('EXPERIMENT_FAILED')
  }
}
