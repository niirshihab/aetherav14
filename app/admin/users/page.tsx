'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  email: string
  user_level: 'regular' | 'admin'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    checkAdminStatus()
    fetchUsers()
  }, [])

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('user_level')
        .eq('id', user.id)
        .single()

      if (error || data?.user_level !== 'admin') {
        router.push('/taskaty') // Redirect non-admin users
      }
    } else {
      router.push('/login') // Redirect unauthenticated users
    }
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, user_level')

      if (error) throw error

      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserLevelChange = async (userId: string, newLevel: 'regular' | 'admin') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ user_level: newLevel })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId ? { ...user, user_level: newLevel } : user
      ))
    } catch (err) {
      console.error('Error updating user level:', err)
      setError('Failed to update user level')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Email</th>
            <th className="text-left">User Level</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.user_level}</td>
              <td>
                <select 
                  value={user.user_level}
                  onChange={(e) => handleUserLevelChange(user.id, e.target.value as 'regular' | 'admin')}
                  className="p-2 border rounded"
                >
                  <option value="regular">Regular</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}