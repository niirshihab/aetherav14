'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TaskCard } from '@/components/TaskCard'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { TaskForm } from '@/components/TaskForm'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'

type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string;
  board_id: string;
  board_name: string;
  user_id: string;
  leeway: string;
}

// Removed the unused TaskInput type declaration


export default function TaskatyPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
        board_name: task.board.name
      })))
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to fetch tasks')
      toast.error('Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'board_id' | 'board_name'>): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...taskData, user_id: user.id })
        .select()

      if (error) throw error

      setTasks([...tasks, data[0] as Task])
      setIsModalOpen(false)
      toast.success('Task created successfully')
    } catch (err) {
      console.error('Error creating task:', err)
      setError('Failed to create task')
      toast.error('Failed to create task')
    }
  }

  const handleEditTask = async (taskId: string, updatedData: Partial<Task>): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updatedData)
        .eq('id', taskId)
        .select()

      if (error) throw error

      setTasks(tasks.map(task => task.id === taskId ? { ...task, ...data[0] } : task))
      toast.success('Task updated successfully')
    } catch (err) {
      console.error('Error updating task:', err)
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      setTasks(tasks.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully')
    } catch (err) {
      console.error('Error deleting task:', err)
      toast.error('Failed to delete task')
    }
  }

  if (isLoading) return <Loader className="mx-auto my-20" size={48} />
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">Create New Task</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={(updatedData) => handleEditTask(task.id, updatedData)} 
            onDelete={() => handleDeleteTask(task.id)} 
          />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}