"use client"
import { useRouter } from "next/navigation"
import { isMobile } from "@/utils/device"

export default function InstructionsPage() {
  const router = useRouter()

  const startTest = async () => {
    if (!isMobile()) {
      await document.documentElement.requestFullscreen()
    }
    router.push("/exam")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Instructions</h2>
        <ul className="space-y-4 text-gray-300 mb-8">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⚠</span>
            Do not switch tabs or apps during the test.
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⚠</span>
            Test will auto-submit on violation.
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⚠</span>
            Camera permission must remain enabled throughout.
          </li>
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-700">
        <div className="max-w-3xl mx-auto">
          <button
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            onClick={startTest}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  )
}
