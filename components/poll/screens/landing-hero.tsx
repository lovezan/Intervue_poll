"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { palette } from "../palette"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type Role = "student" | "teacher" | null

export function LandingHero() {
  const [role, setRole] = useState<Role>(null)
  const router = useRouter()

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-20 pb-12 md:pt-28">
      {/* Badge */}
      <div className="flex justify-center mb-6">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: "#f6f6f6", color: palette.text }}
          aria-label="Intervue Poll"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Intervue Poll
        </span>
      </div>

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-pretty text-3xl md:text-5xl font-semibold tracking-tight" style={{ color: palette.text }}>
          Welcome to the <span className="font-extrabold">Live Polling System</span>
        </h1>
        <p className="mt-3 text-sm md:text-base leading-relaxed" style={{ color: "#6e6e6e" }}>
          Please select the role that best describes you to begin using the live polling system
        </p>
      </div>

      {/* Role cards */}
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        <button
          onClick={() => setRole("student")}
          className={cn("rounded-xl p-5 text-left transition-shadow focus:outline-none", "hover:shadow-sm")}
          style={{
            border: `2px solid ${role === "student" ? palette.brand : "#e6e6e6"}`,
            boxShadow: role === "student" ? "0 0 0 4px rgba(90,102,209,0.10)" : "none",
            backgroundColor: "#ffffff",
          }}
          aria-pressed={role === "student"}
        >
          <div className="text-lg font-semibold" style={{ color: palette.text }}>
            I’m a Student
          </div>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: "#6e6e6e" }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </button>

        <button
          onClick={() => setRole("teacher")}
          className={cn("rounded-xl p-5 text-left transition-shadow focus:outline-none", "hover:shadow-sm")}
          style={{
            border: `2px solid ${role === "teacher" ? palette.brand : "#e6e6e6"}`,
            boxShadow: role === "teacher" ? "0 0 0 4px rgba(90,102,209,0.10)" : "none",
            backgroundColor: "#ffffff",
          }}
          aria-pressed={role === "teacher"}
        >
          <div className="text-lg font-semibold" style={{ color: palette.text }}>
            I’m a Teacher
          </div>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: "#6e6e6e" }}>
            Submit answers and view live poll results in real‑time.
          </p>
        </button>
      </div>

      {/* Continue button */}
      <div className="mt-10 flex justify-center">
        <button
          className="rounded-full px-8 py-3 text-white text-sm md:text-base font-semibold"
          disabled={!role}
          style={{
            backgroundImage: "linear-gradient(90deg, #7765da, #5a66d1)",
            opacity: role ? 1 : 0.6,
          }}
          aria-disabled={!role}
          onClick={() => {
            if (!role) return
            if (role === "student") router.push("/student")
            else router.push("/teacher")
          }}
        >
          Continue
        </button>
      </div>
    </section>
  )
}
