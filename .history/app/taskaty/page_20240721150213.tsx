'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          board:boards(name)
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching tasks:', error)
      } else {
        setTasks(data.map(task => ({
          ...task,
          board_name: task.board.name
        })))
      }
    }

    fetchTasks()
  }, [supabase])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Task Name</th>
            <th className="text-left">Client Name</th>
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
              <td>{task.board_name}</td>
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