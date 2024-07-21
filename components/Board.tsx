'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/Button'
import { TaskCard } from '@/components/TaskCard'
import { Modal } from '@/components/Modal'
import { TaskForm } from '@/components/TaskForm'
import toast from 'react-hot-toast'

type Task = {
  id: string
  title: string
  brand: string
  priority: string
  due_date: string
  status: string
  board_id: string
  user_id: string
}

interface BoardProps {
  boardId: string
  boardName: string
}

export const Board: React.FC<BoardProps> = ({ boardId, boardName }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClientComponentClient()

  const fetchTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('board_id', boardId)

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    }
  }, [supabase, boardId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleAddTask = () => {
    setIsModalOpen(true)
  }

  const handleTaskAction = async (taskData: Omit<Task, 'id' | 'user_id' | 'board_id'>) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: userData.user?.id, board_id: boardId }])
      if (error) throw error
      toast.success('Task added successfully')
      setIsModalOpen(false)
      fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{boardName}</h1>
        <Button onClick={handleAddTask} className="flex items-center">
          <PlusCircle className="mr-2" />
          Add Task
        </Button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Task Name</th>
            <th className="text-left">Brand</th>
            <th className="text-left">Priority</th>
            <th className="text-left">Due Date</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm onSubmit={handleTaskAction} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}