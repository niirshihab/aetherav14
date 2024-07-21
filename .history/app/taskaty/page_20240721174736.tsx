'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { EditableField } from '@/components/EditableField'

type Task = {
  id: string
  name: string
  board_name: string
  priority: string
  tags: string[]
  due_date: string
  status: string
}

const priorityOptions = ['Low', 'Medium', 'High', 'Urgent']
const statusOptions = ['To Do', 'In Progress', 'Done', 'Requires Update']

export default function TaskatyPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTasks()
  }, [])

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

  const updateTask = async (taskId: string, field: string, value: string | string[]) => {
    const { error } = await supabase
      .from('tasks')
      .update({ [field]: value })
      .eq('id', taskId)

    if (error) {
      console.error(`Error updating task ${field}:`, error)
    } else {
      fetchTasks()  // Refresh tasks after update
    }
  }

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
              <td>
                <EditableField
                  value={task.priority}
                  onSave={(value) => updateTask(task.id, 'priority', value as string)}
                  type="select"
                  options={priorityOptions}
                />
              </td>
              <td>
                <EditableField
                  value={task.tags}
                  onSave={(value) => updateTask(task.id, 'tags', value as string[])}
                  type="multi-select"
                  options={['Frontend', 'Backend', 'Design', 'Testing']}  // Example tags
                />
              </td>
              <td>{new Date(task.due_date).toLocaleDateString()}</td>
              <td>
                <EditableField
                  value={task.status}
                  onSave={(value) => updateTask(task.id, 'status', value as string)}
                  type="select"
                  options={statusOptions}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}