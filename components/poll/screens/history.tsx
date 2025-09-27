"use client"

import { X } from "lucide-react"

type Question = {
  id: string
  text: string
  options: { id: string; text: string; isCorrect?: boolean; votes: number }[]
  duration: number
  startedAt: number
  closed?: boolean
  answers: Record<string, string>
}

type PollState = {
  participants: Record<string, any>
  currentQuestion?: Question
  history: Question[]
}

function totalVotes(q: Question) {
  return q.options.reduce((a, b) => a + b.votes, 0)
}

export function HistoryModal({ 
  state, 
  isOpen, 
  onClose 
}: { 
  state: PollState | null
  isOpen: boolean
  onClose: () => void 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold">View Poll History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {state?.history && state.history.length > 0 ? (
            <div className="space-y-6">
              {state.history.map((question, index) => (
                <div key={question.id} className="rounded-lg border overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 font-semibold text-white">
                    Question {index + 1}: {question.text}
                  </div>
                  <div className="p-4 space-y-3">
                    {question.options.map((opt, optIndex) => (
                      <div key={opt.id} className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                          {optIndex + 1}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-2">{opt.text}</div>
                          <div className="w-full h-8 rounded-lg bg-muted relative overflow-hidden">
                            <div
                              className="h-full"
                              style={{
                                width: `${
                                  totalVotes(question) > 0
                                    ? Math.round((opt.votes / totalVotes(question)) * 100)
                                    : 0
                                }%`,
                                background: opt.isCorrect ? "#22c55e" : "#5a66d1",
                              }}
                            />
                            <span className="absolute inset-0 flex items-center justify-end pr-2 text-sm font-medium">
                              {totalVotes(question) > 0
                                ? Math.round((opt.votes / totalVotes(question)) * 100)
                                : 0}
                              %
                            </span>
            </div>
                </div>
              </div>
            ))}
                  </div>
          </div>
        ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No poll history available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}