"use client"
import { useEffect, useState } from "react"

export default function ResultPage() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    const submittedAt = Number(localStorage.getItem("submittedAt"))
    const storedScore = localStorage.getItem("score")

    if (!submittedAt || !storedScore) return

    setScore(Number(storedScore))

    const interval = setInterval(() => {
      const diff = Math.ceil(
        (submittedAt + 30_000 - Date.now()) / 1000
      )
      if (diff <= 0) {
        setTimeLeft(0)
        clearInterval(interval)
      } else {
        setTimeLeft(diff)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (timeLeft === null) {
    return <h2>Loading result...</h2>
  }

  if (timeLeft > 0) {
    return <h2>Result will be available in {timeLeft}s</h2>
  }

  return (
    <div>
      <h2>Result</h2>
      <h3>Score: {score}</h3>
    </div>
  )
}
