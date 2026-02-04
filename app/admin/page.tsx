"use client"
import { useState, useEffect } from "react"
import { questions } from "@/data/questions"

type Attempt = {
  roll: string
  submittedAt: string
  score: number
  attempted: number
  unattempted: number
  answers: number[]
  selfie: string | null
}

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "answers" | "selfie">("list")

  const handleLogin = () => {
    if (password === "admin@123") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password")
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    const roll = localStorage.getItem("roll")
    const answers = localStorage.getItem("answers")
    const submittedAt = localStorage.getItem("submittedAt")
    const selfie = localStorage.getItem("selfie")
    const score = localStorage.getItem("score")
    const attempted = localStorage.getItem("attempted")

    if (!roll || !answers || !submittedAt || !score || !attempted) {
      setAttempts([])
      return
    }

    const parsedAnswers: number[] = JSON.parse(answers)
    const attemptedNum = Number(attempted)
    const unattempted = questions.length - attemptedNum

    setAttempts([
      {
        roll,
        submittedAt: new Date(Number(submittedAt)).toLocaleString(),
        score: Number(score),
        attempted: attemptedNum,
        unattempted,
        answers: parsedAnswers,
        selfie
      }
    ])
  }, [isAuthenticated])

  const backToList = () => {
    setSelectedAttempt(null)
    setViewMode("list")
  }

  /* ---------- LOGIN ---------- */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Admin Login
          </h2>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  /* ---------- ANSWERS VIEW ---------- */
  if (viewMode === "answers" && selectedAttempt) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={backToList}
            className="mb-6 px-4 py-2 bg-gray-700 rounded"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold mb-6">
            Answers – Roll {selectedAttempt.roll}
          </h2>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const sel = selectedAttempt.answers[i]
              return (
                <div key={i} className="bg-gray-900 p-4 rounded">
                  <p className="font-semibold mb-2">{q.question}</p>
                  <p className="text-green-400">
                    Correct: {q.options[q.answer]}
                  </p>
                  <p className="text-blue-400">
                    Selected:{" "}
                    {sel === -1 ? "Not attempted" : q.options[sel]}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ---------- SELFIE VIEW ---------- */
  if (viewMode === "selfie" && selectedAttempt) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={backToList}
            className="mb-6 px-4 py-2 bg-gray-700 rounded"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold mb-6">
            Selfie – Roll {selectedAttempt.roll}
          </h2>

          {selectedAttempt.selfie ? (
            <img
              src={selectedAttempt.selfie}
              alt="Selfie"
              className="max-w-sm rounded"
            />
          ) : (
            <p className="text-gray-400">No selfie captured</p>
          )}
        </div>
      </div>
    )
  }

  /* ---------- LIST ---------- */
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Admin Dashboard
        </h1>

        {attempts.length === 0 && (
          <p className="text-center text-gray-400">No attempts found</p>
        )}

        {attempts.map((a, i) => (
          <div key={i} className="bg-gray-900 p-6 rounded mb-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Roll</p>
                <p>{a.roll}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-blue-400 font-semibold">{a.score}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Attempted</p>
                <p>{a.attempted}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Unattempted</p>
                <p>{a.unattempted}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Submitted</p>
                <p>{a.submittedAt}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedAttempt(a)
                  setViewMode("answers")
                }}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                View Answers
              </button>

              <button
                onClick={() => {
                  setSelectedAttempt(a)
                  setViewMode("selfie")
                }}
                className="bg-green-600 px-4 py-2 rounded"
              >
                View Selfie
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
