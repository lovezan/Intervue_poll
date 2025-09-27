"use client"

import { useState } from "react"
import { CenterCard, Field, PrimaryButton } from "../ui-primitives"

export function StartTeacher({ onCreate }: { onCreate: (classTitle: string, topic: string) => void }) {
  const [classTitle, setClassTitle] = useState("")
  const [topic, setTopic] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (classTitle.trim() && topic.trim()) {
      onCreate(classTitle.trim(), topic.trim())
    }
  }

  return (
    <CenterCard title="Let's Get Started">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="class" className="text-xs" style={{ color: "#454545" }}>
            Class Title
          </label>
          <input
            id="class"
            value={classTitle}
            onChange={(e) => setClassTitle(e.target.value)}
            placeholder="Intro to Statistics"
            className="w-full h-9 rounded-md px-3 border"
            style={{ borderColor: "#e0e0e0" }}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="topic" className="text-xs" style={{ color: "#454545" }}>
            Topic
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Chapter 1: Basics"
            className="w-full h-9 rounded-md px-3 border"
            style={{ borderColor: "#e0e0e0" }}
            required
          />
        </div>
        <PrimaryButton type="submit" className="w-full" disabled={!classTitle.trim() || !topic.trim()}>
          Create Session
        </PrimaryButton>
      </form>
    </CenterCard>
  )
}
