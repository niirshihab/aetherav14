import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.refresh()
  }

  return (
    <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        className="border p-2"
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Sign In
      </button>
    </form>
  )
}