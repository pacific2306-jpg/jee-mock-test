"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { candidates } from "@/data/candidates"

export default function Login() {
  const [roll, setRoll] = useState("")
  const [pass, setPass] = useState("")
  const router = useRouter()

  const login = () => {
    const ok = candidates.find(
      c => c.roll === roll && c.password === pass
    )

    if (!ok) {
      alert("Invalid roll number or password")
      return
    }

    localStorage.setItem("roll", roll)
    router.push("/selfie")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>
        <p className="text-gray-400 text-center mb-6">Enter Roll No & Password</p>
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Roll No"
            value={roll}
            onChange={e => setRoll(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            onClick={login}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
