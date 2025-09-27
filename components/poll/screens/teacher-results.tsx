"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { palette } from "../palette"
import { KebabMenu, ThinProgress, TinyTimer } from "../ui-primitives"

export function TeacherResults() {
  const results = [
    { option: "A", label: "Input that is changed", value: 62 },
    { option: "B", label: "Output measured", value: 21 },
    { option: "C", label: "A constant", value: 12 },
    { option: "D", label: "Random noise", value: 5 },
  ]
  return (
    <div className="w-full flex items-center justify-center py-10">
      <Card className="w-full max-w-xl shadow-sm" style={{ borderColor: palette.border }}>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base" style={{ color: palette.text }}>
            Question 1
          </CardTitle>
          <div className="flex items-center gap-3">
            <TinyTimer text="00:45" />
            <KebabMenu />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.map((r) => (
            <div key={r.option} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: palette.text }}>
                  {r.option}. {r.label}
                </span>
                <span style={{ color: "#828282" }}>{r.value}%</span>
              </div>
              <ThinProgress value={r.value} />
            </div>
          ))}
          <div className="pt-2 text-center text-xs" style={{ color: "#8d8d8d" }}>
            Wait for the teacher to launch a new question.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
