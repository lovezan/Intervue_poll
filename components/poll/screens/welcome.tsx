"use client"

import { CenterCard, PrimaryButton, SubtleButton } from "../ui-primitives"
import { palette } from "../palette"

export function Welcome() {
  return (
    <CenterCard title="Welcome to the Live Polling System">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 p-3 rounded-md" style={{ border: `1px solid ${palette.border}` }}>
          <div className="space-y-1">
            <p className="text-xs font-medium" style={{ color: palette.text }}>
              I’m a Student
            </p>
            <p className="text-xs" style={{ color: "#828282" }}>
              Join a room using a code and answer questions live.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium" style={{ color: palette.text }}>
              I’m a Teacher
            </p>
            <p className="text-xs" style={{ color: "#828282" }}>
              Create, launch and manage interactive polls in class.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <PrimaryButton>Get Started</PrimaryButton>
          <SubtleButton>Learn More</SubtleButton>
        </div>
      </div>
    </CenterCard>
  )
}
