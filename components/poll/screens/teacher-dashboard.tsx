"use client"

import { Card } from "@/components/ui/card"
import { palette } from "../palette"
import { FabAdd, KebabMenu, ThinProgress } from "../ui-primitives"

export function TeacherDashboard() {
  const list = [
    { title: "What is an independent variable?", a: 62 },
    { title: "Mean vs Median?", a: 48 },
    { title: "Sample or Population?", a: 71 },
    { title: "Which chart fits?", a: 33 },
  ]
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-[1fr_minmax(0,420px)] gap-6 py-10">
      <Card className="mx-auto w-full max-w-2xl p-4 space-y-3" style={{ borderColor: palette.border }}>
        <div className="text-sm font-medium mb-2" style={{ color: palette.text }}>
          Questions
        </div>
        {list.map((q, i) => (
          <div key={i} className="rounded-md p-3" style={{ border: `1px solid ${palette.border}` }}>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm" style={{ color: palette.text }}>
                {q.title}
              </div>
              <KebabMenu />
            </div>
            <div className="mt-2">
              <ThinProgress value={q.a} />
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            className="mt-2 rounded-full px-4 py-1.5 text-xs"
            style={{ backgroundColor: palette.brand, color: "#ffffff" }}
          >
            Launch
          </button>
        </div>
      </Card>

      <Card className="mx-auto w-full max-w-xl p-4 space-y-3" style={{ borderColor: palette.border }}>
        <div className="text-sm font-medium" style={{ color: palette.text }}>
          Live Room
        </div>
        <div className="rounded-md p-3 text-xs" style={{ border: `1px solid ${palette.border}`, color: "#6e6e6e" }}>
          Share code{" "}
          <span className="font-semibold" style={{ color: palette.text }}>
            ABC123
          </span>{" "}
          with students to join.
        </div>
        <div className="text-xs" style={{ color: "#8d8d8d" }}>
          Participants: 24 online
        </div>
      </Card>

      <FabAdd />
    </div>
  )
}
