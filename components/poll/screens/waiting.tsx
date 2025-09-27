"use client"

import { CenterCard } from "../ui-primitives"
import { palette } from "../palette"

export function Waiting() {
  return (
    <CenterCard title="">
      <div className="text-center space-y-3">
        <div className="mx-auto">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs"
            style={{ backgroundColor: "#f6f6f6", color: "#454545" }}
          >
            LIVE
          </span>
        </div>
        <div
          className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: palette.brand }}
          aria-hidden
        />
        <p className="text-xs" style={{ color: "#6e6e6e" }}>
          Wait for the teacher to ask questions...
        </p>
      </div>
    </CenterCard>
  )
}
