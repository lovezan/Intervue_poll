import { NextResponse } from "next/server"
import { askQuestion, join, kick, submitAnswer, sendMessage } from "../_store"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const type = body?.type as string

  switch (type) {
    case "join":
      if (!body.clientId || !body.role || !body.name)
        return NextResponse.json({ error: "invalid join" }, { status: 400 })
      join({ id: body.clientId, name: body.name, role: body.role })
      return NextResponse.json({ ok: true })
    case "ask":
      if (!body.clientId || !body.question) return NextResponse.json({ error: "invalid ask" }, { status: 400 })
      askQuestion(body.question)
      return NextResponse.json({ ok: true })
    case "submit":
      if (!body.clientId || !body.optionId) return NextResponse.json({ error: "invalid submit" }, { status: 400 })
      submitAnswer({ clientId: body.clientId, optionId: body.optionId })
      return NextResponse.json({ ok: true })
    case "kick":
      if (!body.targetId) return NextResponse.json({ error: "invalid kick" }, { status: 400 })
      kick(body.targetId)
      return NextResponse.json({ ok: true })
    case "chat": {
      const text = String(body.text || "")
      const clientId = String(body.clientId || "")
      if (!clientId || !text.trim()) return NextResponse.json({ error: "invalid chat" }, { status: 400 })
      sendMessage({ clientId, text })
      return NextResponse.json({ ok: true })
    }
    default:
      return NextResponse.json({ error: "unknown type" }, { status: 400 })
  }
}
