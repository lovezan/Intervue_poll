import { store } from "../../../poll/_store"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const studentId = String(body?.studentId || "")
    const optionId = Number(body?.optionId)
    if (!studentId) throw new Error("studentId required")
    if (Number.isNaN(optionId)) throw new Error("optionId required")
    store.answer(studentId, optionId)
    return Response.json({ ok: true })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Error" }), {
      status: 400,
    })
  }
}
