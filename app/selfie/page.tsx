"use client"
import Camera from "@/components/Camera"
import { useRouter } from "next/navigation"

export default function SelfiePage() {
  const router = useRouter()

  const handleCapture = (img: string) => {
    localStorage.setItem("selfie", img)
    router.push("/instructions")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Capture Selfie</h2>
        <p className="text-gray-400 mb-8">Please ensure your face is clearly visible in the camera.</p>
        <Camera onCapture={handleCapture} />
      </div>
    </div>
  )
}
