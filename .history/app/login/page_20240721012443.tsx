'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
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

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the magic link')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSignIn} className="mb-4">
          <input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            className="w-full p-2 mb-2 text-black"
          />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            className="w-full p-2 mb-4 text-black"
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white">
            Sign In
          </button>
        </form>

        <div className="text-sm mb-4">Email address</div>
        <form onSubmit={handleMagicLink}>
          <input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Your email address"
            className="w-full p-2 mb-4 bg-gray-700 text-white"
          />
          <button type="submit" className="w-full p-2 bg-green-500 text-white">
            Send Magic Link
          </button>
        </form>

        {error && <div className="text-red-500 mt-4">{error}</div>}
        {message && <div className="text-green-500 mt-4">{message}</div>}

        <div className="mt-4 text-center">
          <a href="#" className="text-gray-500 hover:text-white">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  )
}