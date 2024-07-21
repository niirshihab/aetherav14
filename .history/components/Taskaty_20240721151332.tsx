'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Search, Filter, Calendar } from 'lucide-react'
import { Button } from '@/components/Button'
import { TaskCard } from '@/components/TaskCard'
import { Modal } from '@/components/Modal'
import { TaskForm } from '@/components/TaskForm'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import toast from 'react-hot-toast'

type Task = {
  id: string
  title: string
  description: string
  priority: string
  status: string
  due_date: string
  user_id: string
}

export const Taskaty: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ status: '', priority: '' })
  const [isCalendarView, setIsCalendarView] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const supabase = createClientComponentClient()

  const fetchTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('*')
      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    }
  }, [supabase])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    const channel = supabase.channel('tasks')
    const subscription = channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
        console.log('Change received!', payload)
        fetchTasks()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchTasks])

  useEffect(() => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.status === '' || task.status === filters.status) &&
      (filters.priority === '' || task.priority === filters.priority) &&
      (!selectedDate || new Date(task.due_date).toDateString() === selectedDate.toDateString())
    )
    setFilteredTasks(filtered)
  }, [tasks, searchTerm, filters, selectedDate])

  const handleTaskAction = async (taskData: Omit<Task, 'id' | 'user_id'>) => {
    try {
      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTask.id)
        if (error) throw error
        toast.success('Task updated successfully')
      } else {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        const { error } = await supabase
          .from('tasks')
          .insert([{ ...taskData, user_id: userData.user?.id }])
        if (error) throw error
        toast.success('Task added successfully')
      }
      setIsModalOpen(false)
      setEditingTask(null)
      fetchTasks()
    } catch (error) {
      console.error('Error handling task:', error)
      toast.error('Failed to save task')
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
      toast.success('Task deleted successfully')
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Taskaty</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
            <PlusCircle className="mr-2" />
            Add Task
          </Button>
          <Button onClick={() => setIsCalendarView(!isCalendarView)} className="flex items-center">
            <Calendar className="mr-2" />
            {isCalendarView ? 'List View' : 'Calendar View'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-md p-2"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-md p-2"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {isCalendarView ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            inline
            className="w-full"
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Tasks for {selectedDate ? selectedDate.toDateString() : 'selected date'}</h2>
            <ul className="space-y-2">
              {filteredTasks.map(task => (
                <li key={task.id} className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded">
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  onEdit={() => { setEditingTask(task); setIsModalOpen(true); }}
                  onDelete={handleDeleteTask}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(null); }}>
        <TaskForm
          initialData={editingTask || undefined}
          onSubmit={handleTaskAction}
          onCancel={() => { setIsModalOpen(false); setEditingTask(null); }}
        />
      </Modal>
    </div>
  )
}