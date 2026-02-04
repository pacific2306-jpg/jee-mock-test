"use client"

import { useEffect, useState } from "react"
import Timer from "@/components/Timer"
import { questions } from "@/data/questions"
import { startProctoring } from "@/utils/proctoring"

type QWithId = typeof questions[number] & { qid: number }

export default function ExamPage() {
  const [mounted, setMounted] = useState(false)

  const [q] = useState<QWithId[]>(() =>
    questions.map((ques, i) => ({ ...ques, qid: i }))
      .sort(() => Math.random() - 0.5)
  )

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  // ✅ Mark client-side mount
  useEffect(() => {
    setMounted(true)

    if (!localStorage.getItem("answers")) {
      localStorage.setItem(
        "answers",
        JSON.stringify(Array(questions.length).fill(-1))
      )
    }
  }, [])

  // ✅ Start proctoring ONLY after mount
  useEffect(() => {
    if (!mounted) return
    startProctoring(submit)
  }, [mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading exam…
      </div>
    )
  }

  const getAnswers = (): number[] =>
    JSON.parse(localStorage.getItem("answers") || "[]")

  const selectOption = (opt: number) => {
    const arr = getAnswers()
    arr[q[index].qid] = opt
    localStorage.setItem("answers", JSON.stringify(arr))
    setAnswers(arr)
  }

  const submit = () => {
    const arr = getAnswers()
    let score = 0
    let attempted = 0

    q.forEach(qn => {
      const a = arr[qn.qid]
      if (a === -1) return
      attempted++
      score += a === qn.answer ? 4 : -1
    })

    localStorage.setItem("score", score.toString())
    localStorage.setItem("attempted", attempted.toString())
    localStorage.setItem("submittedAt", Date.now().toString())

    window.location.href = "/result"
  }

  const currentAnswers = getAnswers()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Exam</h1>
          <Timer minutes={60} onEnd={submit} />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto p-4 pb-32">
        <h3 className="text-lg font-semibold mb-3">
          Question {index + 1} of {q.length}
        </h3>

        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          {q[index].question}
        </p>

        <div className="space-y-3">
          {q[index].options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition
                ${
                  currentAnswers[q[index].qid] === i
                    ? "bg-blue-900/40 border border-blue-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              <input
                type="radio"
                checked={currentAnswers[q[index].qid] === i}
                onChange={() => selectOption(i)}
                className="mr-3"
              />
              {opt}
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
            className="px-6 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={index === q.length - 1}
            onClick={() => setIndex(index + 1)}
            className="px-6 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={submit}
            className="w-full py-3 bg-red-600 rounded text-lg font-semibold"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  )
}
