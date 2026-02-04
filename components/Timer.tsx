"use client"
import { useEffect, useState } from "react"

type TimerProps = {
  minutes: number
  onEnd: () => void
}

export default function Timer({ minutes, onEnd }: TimerProps) {
  const [time, setTime] = useState(minutes * 60)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(interval)
          onEnd()
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onEnd])

  const mm = Math.floor(time / 60)
  const ss = String(time % 60).padStart(2, "0")

  return (
    <div className="text-white font-semibold">
      Time Left: {mm}:{ss}
    </div>
  )
}
