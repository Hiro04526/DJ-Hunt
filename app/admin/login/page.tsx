"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLoginAction } from '@/actions/auth'

export default function AdminLogin() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    setError('')

    const result = await adminLoginAction(password)

    if (result.success) {
      // Send them exactly to the dashboard route
      router.push('/admin/hitlist') 
    } else {
      setError(result.error || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-8 shadow-lg">
        
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Admin Login
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white placeholder-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  )
}