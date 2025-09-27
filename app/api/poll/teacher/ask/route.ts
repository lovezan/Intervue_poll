import { store } from "../../_store"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    store.askQuestion({
      text: String(body?.text || ""),
      options: Array.isArray(body?.options) ? body.options : [],
      durationSec: Number(body?.durationSec || 60),
    })
    return Response.json({ ok: true })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Error" }), {
      status: 400,
    })
  }
}
