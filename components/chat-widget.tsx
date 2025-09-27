"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Role = "student" | "teacher"
type Client = { id: string; name: string; role: Role; kicked?: boolean }
type ChatMessage = { id: string; clientId: string; name: string; text: string; ts: number }
type Question = {
  id: string
  text: string
  options: { id: string; text: string; isCorrect?: boolean; votes: number }[]
  duration: number
  startedAt: number
  closed?: boolean
  answers: Record<string, string>
}
type PollState = {
  participants: Record<string, Client>
  currentQuestion?: Question
  history: Question[]
  messages?: ChatMessage[]
}

const brand = { purple: "#5a66d1" }

export function ChatWidget({
  state,
  clientId,
  name,
  isTeacher = false,
}: {
  state: PollState | null
  clientId: string
  name: string
  isTeacher?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"chat" | "participants">("chat")
  const [input, setInput] = useState("")
  const listRef = useRef<HTMLDivElement | null>(null)

  const messages = state?.messages || []
  const participants = useMemo(
    () =>
      Object.values(state?.participants || {}).sort((a, b) =>
        a.role === b.role ? a.name.localeCompare(b.name) : a.role === "teacher" ? -1 : 1,
      ),
    [state],
  )

  useEffect(() => {
    // auto-scroll on new messages
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages.length, open, tab])

  async function send() {
    const text = input.trim()
    if (!text) return
    setInput("")
    try {
      await fetch("/api/poll/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "chat", clientId, text }),
      })
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  async function kickOut(id: string) {
    try {
      await fetch("/api/poll/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "kick", targetId: id }),
      })
    } catch (error) {
      console.error("Failed to kick user:", error)
    }
  }

  const you = participants.find((p) => p.id === clientId)
  const online = participants.filter((p) => !p.kicked).length

  return (
    <>
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full text-white shadow-lg"
        style={{ background: brand.purple }}
      >
        <span className="sr-only">Open chat</span>
        <svg width="24" height="24" viewBox="0 0 24 24" className="mx-auto fill-white">
          <path d="M4 4h16v12H7l-3 3V4z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[360px] rounded-lg border bg-background shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="font-semibold">Classroom</div>
            <div className="text-xs text-muted-foreground">{online} online</div>
          </div>

          <div className="flex items-center gap-6 px-4 pt-3">
            <button
              className={cn("pb-2 text-sm font-medium", tab === "chat" ? "border-b-2" : "text-muted-foreground")}
              style={tab === "chat" ? { borderColor: brand.purple, color: brand.purple } : {}}
              onClick={() => setTab("chat")}
            >
              Chat
            </button>
            <button
              className={cn(
                "pb-2 text-sm font-medium",
                tab === "participants" ? "border-b-2" : "text-muted-foreground",
              )}
              style={tab === "participants" ? { borderColor: brand.purple, color: brand.purple } : {}}
              onClick={() => setTab("participants")}
            >
              Participants
            </button>
          </div>

          {tab === "chat" ? (
            <>
              <div ref={listRef} className="max-h-72 overflow-y-auto px-4 py-3 space-y-2">
                {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet. Say hi!</p>}
                {messages.map((m) => {
                  const isYou = m.clientId === clientId
                  return (
                    <div key={m.id} className={cn("flex", isYou ? "justify-end" : "justify-start")}>
                      <div
                        className={cn("rounded-lg px-3 py-2 text-sm", isYou ? "text-white" : "bg-muted")}
                        style={isYou ? { background: brand.purple } : {}}
                      >
                        {!isYou && <div className="text-xs font-medium mb-0.5">{m.name}</div>}
                        <div>{m.text}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    send()
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 h-10 rounded-md px-3 bg-muted"
                    placeholder={`Message as ${you?.name || name}`}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-md text-white font-medium"
                    style={{ background: brand.purple }}
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="max-h-96 overflow-y-auto px-4 py-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left font-medium">Name</th>
                    <th className="text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2">
                        {p.name} {p.kicked && <span className="text-xs text-muted-foreground">(kicked)</span>}
                      </td>
                      <td className="py-2 text-right">
                        {isTeacher && p.role === "student" && !p.kicked ? (
                          <button
                            className="text-blue-600 underline"
                            onClick={() => kickOut(p.id)}
                            aria-label={`Kick out ${p.name}`}
                          >
                            Kick out
                          </button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ChatWidget
