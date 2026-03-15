"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminLoginAction } from "@/actions/auth"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Prevents page reload so enter key works smoothly
    setLoading(true)
    setError("")

    const result = await adminLoginAction(password)

    if (result.success) {
      // Redirect to hitlist dashboard on success
      router.push("/admin/hitlist") 
    } else {
      setError(result.error || "Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-neutral-950">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-center text-white">Admin Access</h1>
        
        {/* Wrapping inputs in a form handles Enter key submission automatically */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
            <input
              autoFocus // Focuses input on load
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-2.5 text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
              placeholder="Enter dashboard password"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-[#1DB954] px-5 py-2.5 text-center text-sm font-bold text-black hover:bg-[#1ed760] disabled:opacity-50 transition-transform active:scale-95"
          >
            {loading ? "Checking..." : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}