"use client"

import { useState } from "react"
// Note: We'll use basic HTML elements and CSS/Tailwind-like classes
// to replicate the custom components (CenterCard, PrimaryButton) visually.

/**
 * Renders the student start screen for joining a poll room, matching the provided image.
 * @param onJoin Callback function to execute when the user submits their name.
 */
export function StartStudent({ onJoin }: { onJoin: (name: string) => void }) {
  // State to hold the user's entered name, pre-filled with "Rahul Bajaj" as seen in the image.
  const [name, setName] = useState("Rahul Bajaj")

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onJoin(name.trim())
    }
  }

  return (
    // Main container to center the content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-lg px-4 text-center pt-24 pb-24">
        {/* 'Intervue Poll' Tag */}
        <div
          className="inline-flex items-center justify-center px-4 py-1 mb-6 rounded-full text-xs font-medium text-white shadow-md"
          style={{ backgroundColor: "#7B4FDF" }} // The specific purple background
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V6a1 1 0 112 0v4h2a1 1 0 110 2h-3a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Intervue Poll
        </div>

        {/* Title: "Let's Get Started" */}
        <h1
          className="text-4xl font-semibold mb-6"
          style={{ color: "#1e1e1e" }}
        >
          Let's Get Started
        </h1>

        {/* Descriptive Text */}
        <p
          className="text-base mb-12 mx-auto max-w-md"
          style={{ color: "#454545", lineHeight: "1.5" }} // Adjusting line-height for visual match
        >
          If you're a student, you'll be able to{" "}
          <strong style={{ fontWeight: "600", color: "#1e1e1e" }}>
            submit your answers
          </strong>
          , participate in live polls, and see how your responses compare with
          your classmates
        </p>

        {/* Form and Input */}
        <form onSubmit={handleSubmit} className="space-y-6 mx-auto max-w-sm">
          {/* Label */}
          <div className="text-left space-y-2">
            <label
              htmlFor="name"
              className="text-base font-medium"
              style={{ color: "#454545" }}
            >
              Enter your Name
            </label>

            {/* Input Field */}
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // Styling to match the light grey background and rounded corners
              className="w-full h-12 rounded-lg px-4 text-lg border-none focus:outline-none"
              style={{
                backgroundColor: "#F7F7F7", // Light grey background of the input
                color: "#1e1e1e",
                boxShadow: "none", // Ensure no default shadow or border
              }}
              required
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            // Use flex-none and specific classes for the button look
            className="w-full h-12 text-lg font-normal text-white rounded-lg transition duration-150 ease-in-out mt-8"
            style={{
              // Gradient from the image (slightly muted purple)
              background: "linear-gradient(to right, #9373FF, #7B4FDF)",
              opacity: name.trim() ? 1 : 0.6, // Dim if disabled, although the image shows it enabled
              border: "none",
            }}
            disabled={!name.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}