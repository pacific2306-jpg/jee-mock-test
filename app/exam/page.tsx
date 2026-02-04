"use client"
import { useEffect, useState } from "react"
import Timer from "@/components/Timer"
import { questions } from "@/data/questions"
import { startProctoring } from "@/utils/proctoring"

export default function ExamPage() {
  const [examStarted, setExamStarted] = useState(false)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [shuffledIndices] = useState(() => [...Array(questions.length).keys()].sort(() => Math.random() - 0.5))
  const q = shuffledIndices.map(i => questions[i])
  const [answers, setAnswers] = useState<number[]>(() => {
    const stored = localStorage.getItem("answers")
    if (stored) {
      return JSON.parse(stored)
    } else {
      const initial = Array(questions.length).fill(-1)
      localStorage.setItem("answers", JSON.stringify(initial))
      return initial
    }
  })
  const [index, setIndex] = useState(0)

  const selectOption = (optIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = optIndex
    setAnswers(newAnswers)
    localStorage.setItem("answers", JSON.stringify(newAnswers))
  }

  const submit = () => {
    const storedAnswers = JSON.parse(localStorage.getItem("answers") || "[]")
    let score = 0
    let attempted = 0
    storedAnswers.forEach((a: number, i: number) => {
      if (a !== -1) {
        attempted++
        const originalIndex = shuffledIndices[i]
        score += a === questions[originalIndex].answer ? 4 : -1
      }
    })

    localStorage.setItem("score", score.toString())
    localStorage.setItem("attempted", attempted.toString())
    localStorage.setItem("submittedAt", Date.now().toString())

    window.location.href = "/result"
  }

  useEffect(() => {
    const today = new Date();
    const examStartTime = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30, 0)); // Today's date, 09:30 UTC = 15:00 IST

    const updateCountdown = () => {
      const now = new Date()
      const istOffset = 5.5 * 60 * 60 * 1000 // IST offset in milliseconds
      const istNow = new Date(now.getTime() + istOffset)
      const remaining = examStartTime.getTime() - istNow.getTime()

      if (remaining <= 0) {
        setExamStarted(true)
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60))
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
        setCountdown({ hours, minutes, seconds })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (examStarted) {
      startProctoring(submit)
    }
  }, [examStarted])

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Exam will start at 3:00 PM</h1>
          <div className="text-6xl font-mono font-bold">
            {String(countdown.hours).padStart(2, '0')} : {String(countdown.minutes).padStart(2, '0')} : {String(countdown.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Exam</h1>
          <Timer minutes={60} onEnd={submit} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Question {index + 1} of {q.length}
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">{q[index].question}</p>
        </div>

        <div className="space-y-3 mb-8">
          {q[index].options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${
                answers[index] === i ? "ring-2 ring-blue-500 bg-gray-700" : ""
              }`}
            >
              <input
                type="radio"
                name={`q-${index}`}
                checked={answers[index] === i}
                onChange={() => selectOption(i)}
                className="mr-3"
              />
              <span className="text-gray-200">{opt}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            disabled={index === q.length - 1}
            onClick={() => setIndex(index + 1)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-700">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={submit}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  )
}
