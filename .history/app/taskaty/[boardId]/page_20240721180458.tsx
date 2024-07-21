'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { KanbanBoard } from '@/components/KanbanBoard'

type Task = {
  id: string
  name: string
  status: string
  priority: string
  due_date: string
}

export default function BoardPage() {
  const params = useParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [boardName, setBoardName] = useState('')
  const [newTask, setNewTask] = useState({ name: '', priority: 'Medium', due_date: '' })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBoardData()
  }, [params.boardId])

  const fetchBoardData = async () => {
    // ... (previous fetchBoardData implementation)
  }

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    // ... (previous handleTaskMove implementation)
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task:', error)
    } else {
      fetchBoardData()  // Refresh tasks after update
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...newTask,
        board_id: params.boardId,
        status: 'To Do',
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()

    if (error) {
      console.error('Error creating task:', error)
    } else {
      setNewTask({ name: '', priority: 'Medium', due_date: '' })
      fetchBoardData()  // Refresh tasks after creating a new one
    }
  }

  const uncompletedTasks = tasks.filter(task => task.status !== 'Done')
  const completedTasks = tasks.filter(task => task.status === 'Done')

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{boardName}</h1>
      
      <form onSubmit={handleCreateTask} className="mb-4">
        <h2 className="text-xl font-bold mb-2">Create New Task</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            placeholder="Task name"
            className="flex-grow p-2 border rounded"
            required
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Add Task
          </button>
        </div>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Uncompleted Tasks</h2>
        <KanbanBoard 
          tasks={uncompletedTasks} 
          onTaskMove={handleTaskMove} 
          onTaskUpdate={handleTaskUpdate}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
        <ul className="bg-gray-100 p-4 rounded">
          {completedTasks.map(task => (
            <li key={task.id} className="mb-2 p-2 bg-white rounded shadow">
              <h4 className="font-bold">{task.name}</h4>
              <p>Priority: {task.priority}</p>
              <p>Completed: {new Date(task.due_date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}