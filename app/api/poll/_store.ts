export type Role = "student" | "teacher"

export type Client = { id: string; name: string; role: Role; kicked?: boolean }
export type Option = { id: string; text: string; isCorrect?: boolean; votes: number }
export type ChatMessage = {
  id: string
  clientId: string
  name: string
  text: string
  ts: number
}
export type Question = {
  id: string
  text: string
  options: Option[]
  duration: number
  startedAt: number
  closed?: boolean
  answers: Record<string, string> // clientId -> optionId
}
export type PollState = {
  participants: Record<string, Client>
  currentQuestion?: Question
  history: Question[]
  messages?: ChatMessage[]
}

const state: PollState = {
  participants: {},
  currentQuestion: undefined,
  history: [],
  messages: [],
}

const connections = new Map<string, Connection>()
let timer: NodeJS.Timeout | null = null

type Connection = {
  id: string
  send: (data: string) => void
}

function broadcast() {
  const payload = JSON.stringify(state)
  for (const c of connections.values()) c.send(`data: ${payload}\n\n`)
}

export function addConnection(id: string, send: (data: string) => void) {
  connections.set(id, { id, send })
  // Immediately send current state
  send(`data: ${JSON.stringify(state)}\n\n`)
}

export function removeConnection(id: string) {
  connections.delete(id)
}

export function join({ id, name, role }: Client) {
  state.participants[id] = { id, name, role }
  broadcast()
}

export function kick(clientId: string) {
  if (state.participants[clientId]) {
    state.participants[clientId].kicked = true
  }
  broadcast()
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

export function askQuestion({
  text,
  duration,
  options,
}: {
  text: string
  duration: number
  options: { text: string; isCorrect?: boolean }[]
}) {
  // Only if no active question or closed
  if (state.currentQuestion && !state.currentQuestion.closed) return
  clearTimer()

  const q: Question = {
    id: crypto.randomUUID(),
    text,
    duration,
    startedAt: Date.now(),
    closed: false,
    answers: {},
    options: options.map((o) => ({ id: crypto.randomUUID(), text: o.text, isCorrect: !!o.isCorrect, votes: 0 })),
  }
  state.currentQuestion = q
  broadcast()

  // Auto-close after duration
  timer = setTimeout(() => {
    closeQuestion()
  }, Math.max(1, duration) * 1000)
}

export function submitAnswer({ clientId, optionId }: { clientId: string; optionId: string }) {
  const q = state.currentQuestion
  if (!q || q.closed) return
  // avoid duplicate submission
  if (q.answers[clientId]) return
  const opt = q.options.find((o) => o.id === optionId)
  if (!opt) return
  q.answers[clientId] = optionId
  opt.votes += 1

  // If all students answered, close early
  const studentIds = Object.values(state.participants)
    .filter((p) => p.role === "student" && !p.kicked)
    .map((p) => p.id)
  const answeredIds = Object.keys(q.answers || {})
  if (studentIds.length > 0 && studentIds.every((id) => answeredIds.includes(id))) {
    closeQuestion()
    return
  }

  broadcast()
}

export function closeQuestion() {
  const q = state.currentQuestion
  if (!q || q.closed) return
  q.closed = true
  state.history.unshift(q)
  clearTimer()
  broadcast()
}

export function sendMessage({ clientId, text }: { clientId: string; text: string }) {
  const from = state.participants[clientId]
  const safe = String(text || "")
    .trim()
    .slice(0, 500)
  if (!from || !safe) return
  state.messages = state.messages || []
  state.messages.push({
    id: crypto.randomUUID(),
    clientId,
    name: from.name || (from.role === "teacher" ? "Teacher" : "Student"),
    text: safe,
    ts: Date.now(),
  })
  // limit history to avoid unbounded growth
  if (state.messages.length > 500) state.messages.splice(0, state.messages.length - 500)
  broadcast()
}

export function getState() {
  return state
}

export const store = {
  // Create a student client and join. Returns the created client.
  join(name: string) {
    const id = crypto.randomUUID()
    const client = { id, name: String(name || "").trim(), role: "student" as const }
    if (!client.name) throw new Error("Name required")
    join(client)
    return client
  },

  // Submit an answer. Accepts option index (number) or option id (string).
  answer(clientId: string, optionId: number | string) {
    const q = getState().currentQuestion
    if (!q || q.closed) return
    let resolved: string | undefined
    if (typeof optionId === "number") {
      resolved = q.options[optionId]?.id
    } else {
      resolved = optionId
    }
    if (!resolved) return
    submitAnswer({ clientId, optionId: resolved })
  },

  // Ask a question. Accepts durationSec, adapts to internal `duration`.
  askQuestion({
    text,
    options,
    durationSec,
  }: {
    text: string
    options: { text: string; isCorrect?: boolean }[]
    durationSec: number
  }) {
    askQuestion({
      text,
      options,
      duration: Number(durationSec || 60),
    })
  },

  // Convenient pass-throughs
  getState,
  kick,
  closeQuestion,

  // Expose chat for convenience
  chat(clientId: string, text: string) {
    sendMessage({ clientId, text })
  },
}
