"use client"
import { useRef, useState } from "react"

type CameraProps = {
  onCapture: (img: string) => void
}

export default function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [cameraStarted, setCameraStarted] = useState(false)

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      setCameraStarted(true)
    }
  }

  const capture = () => {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = 300
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0, 300, 200)
    onCapture(canvas.toDataURL())
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md border-2 border-gray-600 rounded-lg"
      />
      <div className="flex space-x-4">
        <button
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={startCamera}
        >
          Start Camera
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={capture}
          disabled={!cameraStarted}
        >
          Capture
        </button>
      </div>
    </div>
  )
}
