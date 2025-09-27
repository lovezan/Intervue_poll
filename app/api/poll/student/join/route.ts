import { store } from "../../../poll/_store"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body?.name || "").trim()
    if (!name) throw new Error("Name required")
    const student = store.join(name)
    return Response.json({ ok: true, student })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Error" }), {
      status: 400,
    })
  }
}
