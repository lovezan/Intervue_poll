"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import ChatWidget from "@/components/chat-widget"
import { StartTeacher } from "@/components/poll/screens/start-teacher"
import { HistoryModal } from "@/components/poll/screens/history"
import { History, X } from "lucide-react"

type Role = "student" | "teacher"
type Client = { id: string; name: string; role: Role; kicked?: boolean }
type Option = { id: string; text: string; isCorrect?: boolean; votes: number }
type Question = {
  id: string
  text: string
  options: Option[]
  duration: number
  startedAt: number
  closed?: boolean
  answers: Record<string, string>
}
type PollState = { participants: Record<string, Client>; currentQuestion?: Question; history: Question[] }

const brand = { purple: "#5a66d1", purpleDark: "#4f0dce" }

function getClientId() {
  let id = sessionStorage.getItem("teacherId")
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem("teacherId", id)
  }
  return id
}

export default function TeacherPage() {
  const clientId = useMemo(getClientId, [])
  const [state, setState] = useState<PollState | null>(null)
  const [qText, setQText] = useState("")
  const [duration, setDuration] = useState(60)
  const [options, setOptions] = useState<{ id: string; text: string; isCorrect?: boolean }[]>([
    { id: crypto.randomUUID(), text: "" },
    { id: crypto.randomUUID(), text: "" },
  ])
  const [sessionStarted, setSessionStarted] = useState(false)
  const [classTitle, setClassTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [showLiveResults, setShowLiveResults] = useState(false)
  const sseRef = useRef<EventSource | null>(null)

  const connectSSE = () => {
    if (sseRef.current) return
    const es = new EventSource(`/api/poll/sse?clientId=${clientId}`)
    sseRef.current = es
    es.addEventListener("message", (e) => {
      const data = JSON.parse(e.data) as PollState
      setState(data)
    })
    es.addEventListener("error", () => {
      es.close()
      sseRef.current = null
      setTimeout(connectSSE, 800)
    })
  }

  const startSession = async (title: string, topicName: string) => {
    setClassTitle(title)
    setTopic(topicName)
    setSessionStarted(true)
    await fetch("/api/poll/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "join", clientId, role: "teacher", name: "Teacher" }),
    })
    connectSSE()
  }

  useEffect(() => {
    // Auto-join if session already started
    if (sessionStarted) {
    fetch("/api/poll/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "join", clientId, role: "teacher", name: "Teacher" }),
    }).then(() => connectSSE())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStarted])

  const canAskNew = !state?.currentQuestion || state?.currentQuestion?.closed || allStudentsAnswered(state)

  async function askQuestion() {
    if (!qText.trim() || options.filter((o) => o.text.trim()).length < 2) return
    await fetch("/api/poll/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ask",
        clientId,
        question: {
          text: qText.trim(),
          duration,
          options: options.filter((o) => o.text.trim()).map((o) => ({ text: o.text.trim(), isCorrect: !!o.isCorrect })),
        },
      }),
    })
    setQText("")
    setOptions([
      { id: crypto.randomUUID(), text: "" },
      { id: crypto.randomUUID(), text: "" },
    ])
    setShowLiveResults(true)
  }

  const goBackToQuestionCreation = () => {
    setShowLiveResults(false)
  }

  if (!sessionStarted) {
    return (
      <main className="min-h-dvh bg-background text-white text-foreground flex items-start justify-center">
        <div className="w-full max-w-5xl px-6 pt-14 pb-28 text-center ">
          <span
            className="inline-flex items-center text-white rounded-full px-3 py-1 text-sm font-medium"
            style={{
              //  gradient for the background
              background: `linear-gradient(90deg, ${brand.purple}, ${brand.purpleDark})`,
            }}
          >
            ✨ Intervue Poll
          </span>
          <StartTeacher onCreate={startSession} />
        </div>
      </main>
    )
  }

  // Live Results Screen (after asking question)
  if (showLiveResults && state?.currentQuestion) {
    const questionNumber = (state?.history?.length || 0) + 1
    
    return (
      <main className="min-h-dvh bg-background text-foreground flex items-start justify-center">
        <div className="w-full max-w-5xl px-6 pt-14 pb-28">
        <div className="flex items-center justify-end mb-6">
          {state?.history && state.history.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              // Changed rounded-2xl to rounded-full for a pill shape
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
              // Applied the solid background color using the style attribute
              style={{ background: "#8F64E1" }}
            >
              <History className="w-4 h-4" />
              View Poll History
            </button>
          )}
        </div>

          <div className="mx-auto mt-8 w-full max-w-2xl">
            <div className="flex items-center justify-start gap-4 mb-2">
              <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 font-semibold text-white">{state.currentQuestion.text}</div>
              <div className="p-4 space-y-3">
                {state.currentQuestion.options.map((opt, index) => {
                  const percentage = totalVotes(state.currentQuestion!) > 0 
                    ? Math.round((opt.votes / totalVotes(state.currentQuestion!)) * 100) 
                    : 0
                  const isCorrect = opt.isCorrect
                  
                  // Determine text colors based on percentage and position
                  const optionTextColor = percentage === 0 ? "#1f2937" : "white" // Dark gray for 0%, white for others
                  const percentageTextColor = percentage === 0 ? "#1f2937" : (percentage === 100 ? "white" : "#1f2937")
                  
                  return (
                    <div key={opt.id} className="transform transition-all duration-300 hover:scale-[1.01]">
                      <button
                        disabled={true}
                        className="w-full rounded-lg border-0 px-4 py-3 text-left transition-all duration-1000 ease-out flex items-center gap-3 cursor-default shadow-sm hover:shadow-md"
                        style={{
                          background: `linear-gradient(90deg, ${isCorrect ? brand.purple : "#9ca3af"} ${percentage}%, #f3f4f6 ${percentage}%)`,
                          border: "none",
                        }}
                      >
                        <span 
                          className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-transform duration-200 hover:scale-105"
                          style={{ color: "#374151" }}
                        >
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span 
                              className="font-medium transition-colors duration-300"
                              style={{ color: optionTextColor }}
                            >
                              {opt.text}
                            </span>
                            <span 
                              className="text-sm font-medium ml-2 flex-shrink-0 transition-colors duration-300"
                              style={{ color: percentageTextColor }}
                            >
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={goBackToQuestionCreation}
                className="h-12 px-6 rounded-full text-white font-semibold flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-105 transform"
                style={{ background: `linear-gradient(90deg, ${brand.purple}, ${brand.purpleDark})` }}
              >
                <span className="text-xl">+</span>
                Ask a new question
              </button>
            </div>
          </div>

          <ChatWidget state={state} clientId={clientId} name={"Teacher"} isTeacher={true} />

          <HistoryModal 
            state={state} 
            isOpen={showHistory} 
            onClose={() => setShowHistory(false)} 
          />
        </div>
      </main>
    )
  }

  // Question Creation Screen
  return (
    <main className="min-h-dvh bg-background text-foreground flex items-start justify-center">
      <div className="w-full max-w-5xl px-6 pt-14 pb-28">
        <span
          className="inline-flex items-center text-white rounded-full px-3 py-1 text-sm font-medium"
          style={{
            //  gradient for the background
            background: `linear-gradient(90deg, ${brand.purple}, ${brand.purpleDark})`,
          }}
        >
          ✨ Intervue Poll
        </span>

        <h1 className="mt-6 text-4xl font-semibold">
          {classTitle} - <span className="font-extrabold">{topic}</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold">Enter your question</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number.parseInt(e.target.value))}
              className="rounded-lg border bg-muted px-3 py-2 text-sm"
            >
              {[30, 45, 60, 90].map((s) => (
                <option key={s} value={s}>
                  {s} seconds
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            className="mt-3 w-full min-h-[140px] rounded-lg bg-muted p-4"
            placeholder="Type your question here..."
            maxLength={100}
          />
          <div className="mt-1 text-right text-sm text-muted-foreground">{qText.length}/100</div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold">Edit Options</h3>
              <div className="mt-3 space-y-4">
                {options.map((o, idx) => (
                  <div key={o.id} className="flex items-center gap-3">
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-sm font-semibold"
                      style={{ background: "#5a66d1" }}
                    >
                      {idx + 1}
                    </span>
                    <input
                      value={o.text}
                      onChange={(e) =>
                        setOptions((prev) => prev.map((p) => (p.id === o.id ? { ...p, text: e.target.value } : p)))
                      }
                      className="flex-1 h-11 rounded-md bg-muted px-3"
                      placeholder="Option text"
                    />
                  </div>
                ))}
              </div>
              <button
                className="mt-4 h-10 px-4 rounded-lg text-sm font-medium border"
                onClick={() => setOptions((p) => [...p, { id: crypto.randomUUID(), text: "" }])}
                style={{ borderColor: "#5a66d1", color: "#5a66d1" }}
              >
                + Add More option
              </button>
            </div>

            <div>
              <h3 className="text-base font-semibold">Is it Correct?</h3>
              <div className="mt-4 space-y-6">
                {options.map((o) => (
                  <div key={o.id} className="flex items-center gap-6">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={`corr-${o.id}`}
                        checked={!!o.isCorrect}
                        onChange={() =>
                          setOptions((prev) =>
                            prev.map((p) => (p.id === o.id ? { ...p, isCorrect: true } : { ...p, isCorrect: false })),
                          )
                        }
                      />
                      Yes
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={`corr-${o.id}`}
                        checked={!o.isCorrect}
                        onChange={() =>
                          setOptions((prev) => prev.map((p) => (p.id === o.id ? { ...p, isCorrect: false } : p)))
                        }
                      />
                      No
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="fixed bottom-0 inset-x-0 border-t bg-background">
          <div className="mx-auto max-w-5xl px-6 py-4 flex justify-end">
            <button
              onClick={askQuestion}
              disabled={!canAskNew}
              className={cn(
                "h-12 px-6 rounded-full text-white font-semibold",
                !canAskNew && "opacity-50 cursor-not-allowed",
              )}
              style={{ background: `linear-gradient(90deg, ${brand.purple}, ${brand.purpleDark})` }}
            >
              Ask Question
            </button>
          </div>
        </footer>
      </div>
    </main>
  )
}

function totalVotes(q: Question) {
  return q.options.reduce((a, b) => a + b.votes, 0)
}

function allStudentsAnswered(state: PollState | null) {
  if (!state?.currentQuestion) return false
  const studentIds = Object.values(state.participants)
    .filter((p) => p.role === "student" && !p.kicked)
    .map((p) => p.id)
  const answeredIds = Object.keys(state.currentQuestion.answers || {})
  return studentIds.length > 0 && studentIds.every((id) => answeredIds.includes(id))
}