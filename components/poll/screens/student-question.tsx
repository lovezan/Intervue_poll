"use client"

import { CenterCard, PrimaryButton, RadioOptions } from "../ui-primitives"

export function StudentQuestion() {
  return (
    <CenterCard title="Question 1">
      <div className="space-y-4">
        <div className="text-sm">What is an independent variable?</div>
        <RadioOptions
          name="q1"
          options={[
            { id: "a", label: "The input that is changed" },
            { id: "b", label: "The output being measured" },
            { id: "c", label: "A constant that never changes" },
            { id: "d", label: "Random noise" },
          ]}
        />
        <PrimaryButton className="w-full">Submit</PrimaryButton>
      </div>
    </CenterCard>
  )
}
