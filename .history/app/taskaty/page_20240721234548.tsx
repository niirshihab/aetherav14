'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Edit2, Save, X } from 'lucide-react'

type Task = {
  id: string
  name: string
  board_id: string
  board_name: string
  priority: string
  tags: string[]
  due_date: string
  status: string
  description: string
}

export default function TaskatyPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editedTask, setEditedTask] = useState<Task | null>(null)
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
          board:boards(id, name)
        `)
        .eq('user_id', user.id)

      if (error) throw error

      setTasks(data.map(task => ({
        ...task,
        board_id: task.board.id,
        board_name: task.board.name
      })))
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStart = (task: Task) => {
    setEditingTask(task.id)
    setEditedTask(task)
  }

  const handleEditCancel = () => {
    setEditingTask(null)
    setEditedTask(null)
  }

  const handleEditSave = async () => {
    if (!editedTask) return

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          name: editedTask.name,
          priority: editedTask.priority,
          tags: editedTask.tags,
          due_date: editedTask.due_date,
          status: editedTask.status,
          description: editedTask.description
        })
        .eq('id', editedTask.id)

      if (error) throw error

      setTasks(tasks.map(task => 
        task.id === editedTask.id ? editedTask : task
      ))
      setEditingTask(null)
      setEditedTask(null)
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

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
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>
                {editingTask === task.id ? (
                  <input
                    type="text"
                    value={editedTask?.name || ''}
                    onChange={(e) => setEditedTask(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="w-full p-1 border rounded"
                  />
                ) : task.name}
              </td>
              <td>
                <Link href={`/taskaty/${task.board_id}`} className="text-blue-500 hover:underline">
                  {task.board_name}
                </Link>
              </td>
              <td>
                {editingTask === task.id ? (
                  <select
                    value={editedTask?.priority || ''}
                    onChange={(e) => setEditedTask(prev => prev ? {...prev, priority: e.target.value} : null)}
                    className="w-full p-1 border rounded"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                ) : task.priority}
              </td>
              <td>
                {editingTask === task.id ? (
                  <input
                    type="text"
                    value={editedTask?.tags.join(', ') || ''}
                    onChange={(e) => setEditedTask(prev => prev ? {...prev, tags: e.target.value.split(', ')} : null)}
                    className="w-full p-1 border rounded"
                  />
                ) : task.tags.join(', ')}
              </td>
              <td>
                {editingTask === task.id ? (
                  <input
                    type="date"
                    value={editedTask?.due_date || ''}
                    onChange={(e) => setEditedTask(prev => prev ? {...prev, due_date: e.target.value} : null)}
                    className="w-full p-1 border rounded"
                  />
                ) : new Date(task.due_date).toLocaleDateString()}
              </td>
              <td>
                {editingTask === task.id ? (
                  <select
                    value={editedTask?.status || ''}
                    onChange={(e) => setEditedTask(prev => prev ? {...prev, status: e.target.value} : null)}
                    className="w-full p-1 border rounded"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                ) : task.status}
              </td>
              <td>
                {editingTask === task.id ? (
                  <>
                    <button onClick={handleEditSave} className="mr-2"><Save size={18} /></button>
                    <button onClick={handleEditCancel}><X size={18} /></button>
                  </>
                ) : (
                  <button onClick={() => handleEditStart(task)}><Edit2 size={18} /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}