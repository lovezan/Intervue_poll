"use client"

import { CenterCard } from "../ui-primitives"
import { palette } from "../palette"

export function KickedOut() {
  return (
    <CenterCard title="">
      <div className="text-center space-y-2">
        <div className="mx-auto">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs"
            style={{ backgroundColor: "#f6f6f6", color: "#454545" }}
          >
            Notice
          </span>
        </div>
        <div className="text-sm font-medium" style={{ color: palette.text }}>
          You’ve been kicked out!
        </div>
        <p className="text-[11px]" style={{ color: "#8d8d8d" }}>
          The teacher removed you from the room. You can rejoin with a new code.
        </p>
      </div>
    </CenterCard>
  )
}
