'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else if (user) {
      const { data: sessionData, error: sessionError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (sessionError && sessionError.code !== 'PGRST116') {
        setError(sessionError.message)
        return
      }

      const currentTime = new Date()
      const lastLogin = sessionData ? new Date(sessionData.last_login) : new Date(0)
      const timeDiff = (currentTime.getTime() - lastLogin.getTime()) / (1000 * 3600) // in hours

      if (!sessionData || timeDiff > 24 || sessionData.last_ip !== (await getIpAddress())) {
        // Require email authentication
        const { error: authError } = await supabase.auth.signOut()
        if (authError) {
          setError(authError.message)
        } else {
          router.push('/auth/email-auth')
        }
      } else {
        // Update session
        const { error: updateError } = await supabase
          .from('user_sessions')
          .upsert({ user_id: user.id, last_login: currentTime.toISOString(), last_ip: await getIpAddress() })

        if (updateError) {
          setError(updateError.message)
        } else {
          router.push('/dashboard')
        }
      }
    }
  }

  async function getIpAddress() {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
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
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      <div className="mt-8">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
          view="magic_link"
        />
      </div>
    </div>
  )
}