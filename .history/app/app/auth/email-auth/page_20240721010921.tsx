import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

export default function EmailAuth() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the login link')
    }
  }

  return (
    <form onSubmit={handleEmailAuth} className="flex flex-col space-y-4 max-w-md mx-auto mt-8">
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Send Authentication Email
      </button>
      {message && <p className="text-green-500">{message}</p>}
    </form>
  )
}