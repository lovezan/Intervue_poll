import { addConnection, removeConnection } from "../_store"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("clientId") || crypto.randomUUID()

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      addConnection(id, (data) => controller.enqueue(encoder.encode(data)))
    },
    cancel() {
      removeConnection(id)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
