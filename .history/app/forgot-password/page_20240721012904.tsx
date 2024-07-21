'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset email sent. Check your inbox.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-xs">
        <h2 className="text-2xl mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
          <button type="submit" className="w-full p-3 bg-green-500 text-white rounded font-semibold">
            Send Reset Link
          </button>
        </form>
        {message && <div className="mt-4 text-center">{message}</div>}
      </div>
    </div>
  )
}