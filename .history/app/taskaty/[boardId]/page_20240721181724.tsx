'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { KanbanBoard } from '@/components/KanbanBoard'
import { Loader, Search } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBoardData()
  }, [params.boardId])

  const fetchBoardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: boardData, error: boardError } = await supabase
        .from('boards')
        .select('name')
        .eq('id', params.boardId)
        .single()

      if (boardError) throw boardError
      setBoardName(boardData.name)

      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('board_id', params.boardId)

      if (tasksError) throw tasksError
      setTasks(tasksData || [])
    } catch (err) {
      console.error('Error fetching board data:', err)
      setError('Failed to load board data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    setError(null)
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task))
    } catch (err) {
      console.error('Error moving task:', err)
      setError('Failed to move task. Please try again.')
    }
  }

  const handleTaskUpdate = async (taskId: string, updatedTask: Partial<Task>) => {
    setError(null)
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', taskId)

      if (error) throw error
      setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task))
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task. Please try again.')
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...newTask, board_id: params.boardId })
        .select()

      if (error) throw error
      setTasks([...tasks, ...data])
      setNewTask({ name: '', priority: 'Medium', due_date: '' })
    } catch (err) {
      console.error('Error creating task:', err)
      setError('Failed to create task. Please try again.')
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tasks, searchTerm])

  const uncompletedTasks = filteredTasks.filter(task => task.status !== 'Done')
  const completedTasks = filteredTasks.filter(task => task.status === 'Done')

  if (isLoading) {
    return <Loader className="mx-auto my-20" size={48} />
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{boardName}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

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