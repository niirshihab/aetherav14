'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSignIn} className="mb-4 space-y-4">
          <input
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            className="w-full p-3 bg-white text-black rounded"
            required
          />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            className="w-full p-3 bg-white text-black rounded"
            required
          />
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded font-semibold">
            Sign In
          </button>
        </form>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="text-center">
          <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}