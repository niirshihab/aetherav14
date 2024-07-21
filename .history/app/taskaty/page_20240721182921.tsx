'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

type Task = {
  id: string
  name: string
  board_name: string
  priority: string
  tags: string[]
  due_date: string
  status: string
}

export default function TaskatyPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          board:boards(name)
        `)
        .eq('user_id', user.id)

      if (error) throw error

      setTasks(data.map(task => ({
        ...task,
        board_name: task.board.name
      })))
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Task Name</th>
            <th className="text-left">Board</th>
            <th className="text-left">Priority</th>
            <th className="text-left">Tags</th>
            <th className="text-left">Due Date</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>
                <Link href={`/taskaty/${task.board.id}`} className="text-blue-500 hover:underline">
                  {task.board_name}
                </Link>
              </td>
              <td>{task.priority}</td>
              <td>{task.tags.join(', ')}</td>
              <td>{new Date(task.due_date).toLocaleDateString()}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}