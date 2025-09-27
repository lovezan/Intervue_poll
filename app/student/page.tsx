"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import ChatWidget from "@/components/chat-widget"
import { StartStudent } from "@/components/poll/screens/start-student"

type Role = "student" | "teacher"

type Client = {
  id: string
  name: string
  role: Role
  kicked?: boolean
}

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
type PollState = {
  participants: Record<string, Client>
  currentQuestion?: Question
  history: Question[]
}

function getClientId() {
  let id = localStorage.getItem("clientId")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("clientId", id)
  }
  return id
}

const brand = { purple: "#5a66d1", purpleDark: "#4f0dce" }

export default function StudentPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [state, setState] = useState<PollState | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const sseRef = useRef<EventSource | null>(null)
  const clientId = useMemo(getClientId, [])

  useEffect(() => {
    const stored = localStorage.getItem("studentName")
    if (stored) setName(stored)
  }, [])

  // connect to SSE once joined
  const connectSSE = () => {
    if (sseRef.current) return
    const es = new EventSource(`/api/poll/sse?clientId=${clientId}`)
    sseRef.current = es
    es.addEventListener("message", (e) => {
      const data = JSON.parse(e.data) as PollState
      setState(data)
      const cq = data.currentQuestion
      const already = cq?.answers?.[clientId]
      setAnswered(Boolean(already) || Boolean(cq?.closed))
      if (already) setSelectedOption(already)
    })
    es.addEventListener("error", () => {
      es.close()
      sseRef.current = null
      setTimeout(connectSSE, 800)
    })
  }

  const join = async () => {
    if (!name.trim()) return
    localStorage.setItem("studentName", name.trim())
    await fetch("/api/poll/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "join", clientId, role: "student", name: name.trim() }),
    })
    connectSSE()
  }

  useEffect(() => {
    // auto-join if name exists
    if (name.trim()) join()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  const submit = async () => {
    if (!selectedOption || !state?.currentQuestion) return
    await fetch("/api/poll/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "submit",
        clientId,
        optionId: selectedOption,
      }),
    })
    setAnswered(true)
  }

  const kicked = state?.participants?.[clientId]?.kicked
  const cq = state?.currentQuestion
  const remainingSec = useRemainingSeconds(cq)

  if (!name.trim()) {
    return (
      <Shell>
        <HeaderBadge />
        <h1 className="mt-10 text-4xl font-semibold text-center">
          Let’s <span className="font-extrabold">Get Started</span>
        </h1>
      {/* Descriptive Text Container */}
        <div className="text-center mx-auto mt-4 mb-12 max-w-lg">
          <p
            className="text-base"
            style={{ color: "#454545", lineHeight: "1.5" }}
          >
            If you're a student, you'll be able to{" "}
            <strong style={{ fontWeight: "600", color: "#1e1e1e" }}>
              submit your answers
            </strong>
            , participate in live polls, and see how your responses compare with
            <br/> {/* FORCED LINE BREAK to create two lines */}
            your classmates
          </p>
        </div>

        <div className="mx-auto mt-10 w-full max-w-xl">
          <label className="block text-sm font-medium mb-2">Enter your Name</label>
          <input
            placeholder="Your Name"
            className="w-full rounded-md h-12 px-4 bg-muted"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-center mt-8">
            <button
              onClick={join}
              className="h-12 px-8 rounded-full text-white font-semibold"
              style={{ background: `linear-gradient(90deg, ${brand.purple}, ${brand.purpleDark})` }}
            >
              Continue
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  if (kicked) {
    return (
      <Shell>
        <HeaderBadge />
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-center mb-4">
            You've been <span className="font-extrabold">Kicked out</span>!
          </h2>
          <p className="text-lg text-center text-gray-700">
            Looks like the teacher had removed you from the poll system. Please<br />
            Try again sometime.
          </p>
        </div>
      </Shell>
    )
  }

  if (!cq) {
    return (
      <Shell>
        <HeaderBadge />
        <div className="mt-16 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 animate-spin" style={{ borderColor: brand.purple, borderTopColor: "transparent" }} />
          <h2 className="text-2xl font-bold text-center">Wait for the teacher to ask questions..</h2>
        </div>
        <ChatWidget state={state} clientId={clientId} name={name || "Student"} isTeacher={false} />
      </Shell>
    )
  }

  const answeredOptionId = cq.answers?.[clientId]
  const questionNumber = (state?.history?.length || 0) + 1

  return (
    <Shell>
      <div className="mx-auto w-fit">
        <HeaderBadge />
      </div>

      <div className="mx-auto mt-8 w-full max-w-2xl">
        <div className="flex items-center justify-start gap-4 mb-2">
          <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
          {!answered && remainingSec !== null && (
            <div className="text-sm text-red-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="black" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {String(Math.floor(remainingSec / 60)).padStart(2, '0')}:{String(remainingSec % 60).padStart(2, '0')}
            </div>
          )}
        </div>
        <div className="rounded-lg border overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 font-semibold text-white">{cq.text}</div>
          <div className="p-4 space-y-3">
            {cq.options.map((opt, index) => (
              <div key={opt.id} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <button
                  disabled={answered}
                  onClick={() => setSelectedOption(opt.id)}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-3 text-left transition-colors",
                    "bg-background hover:bg-gray-50",
                    selectedOption === opt.id && !answered && "border-[#5a66d1] ring-2 ring-[#5a66d1]/30",
                  )}
                >
                  <span className="font-medium">{opt.text}</span>
                  {answered && (
                    <div className="mt-2">
                      <ResultsBar
                        value={opt.votes}
                        total={cq.options.reduce((a, b) => a + b.votes, 0)}
                        highlight={answeredOptionId === opt.id}
                      />
                    </div>
                  )}
                </button>
              </div>
            ))}
            {answered ? (
              <p className="text-center text-sm text-muted-foreground">Wait for the teacher to ask a new question..</p>
            ) : null}
          </div>
        </div>
        {/* MOVED ELEMENT START HERE */}
          {answered ? (
            // Updated classes: text-black for color, font-bold for bold text.
            <p className="text-center text-sm text-black font-bold mt-4">Wait for the teacher to ask a new question..</p>
          ) : null}
        {!answered && (
          <div className="pt-3 flex justify-end">
            <button
              disabled={!selectedOption}
              onClick={submit}
              className={cn(
                "h-11 px-6 rounded-full text-white font-semibold",
                !selectedOption && "opacity-50 cursor-not-allowed",
              )}
              style={{ background: `linear-gradient(90deg, ${brand.purple}, ${brand.purpleDark})` }}
            >
              Submit
            </button>
          </div>
        )}
        <ChatWidget state={state} clientId={clientId} name={name || "Student"} isTeacher={false} />
      </div>
    </Shell>
  )
}

function useRemainingSeconds(q?: Question) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [])
  if (!q || !q.startedAt || !q.duration) return null
  const end = q.startedAt + q.duration * 1000
  const left = Math.max(0, Math.ceil((end - Date.now()) / 1000))
  return left
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-background text-foreground flex items-start justify-center">
      <div className="w-full max-w-5xl px-6 pt-16 pb-12">{children}</div>
    </main>
  )
}

function HeaderBadge() {
  return (
    // Add a block container and center its text/children
    <div className="w-full text-center"> 
      <span
        className="inline-flex items-center text-white rounded-full px-3 py-1 text-sm font-medium"
        style={{
          //  gradient for the background
          background: `linear-gradient(90deg, ${brand.purple}, ${brand.purpleDark})`,
        }}
      >
        ✨ Intervue Poll
      </span>
    </div>
  )
}

function Loader() {
  return (
    <div
      className="h-12 w-12 rounded-full border-4 animate-spin"
      style={{ borderColor: "#5a66d1", borderTopColor: "transparent" }}
      aria-label="Loading"
    />
  )
}

function ResultsBar({ value, total, highlight }: { value: number; total: number; highlight?: boolean }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="w-full h-8 rounded-lg bg-muted relative overflow-hidden">
      <div
        className="h-full transition-[width] duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: highlight ? "#5a66d1" : "#8f64e1",
        }}
      />
      <span className="absolute inset-0 flex items-center justify-end pr-2 text-sm font-medium">{pct}%</span>
    </div>
  )
}
