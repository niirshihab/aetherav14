'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { PlusCircle, Search, Filter } from 'lucide-react'
import { Button } from '@/components/Button'
import { TaskCard } from '@/components/TaskCard'
import { Modal } from '@/components/Modal'
import { TaskForm } from '@/components/TaskForm'

export const Taskaty = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ status: '', priority: '', brand: '' })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.status === '' || task.status === filters.status) &&
      (filters.priority === '' || task.priority === filters.priority) &&
      (filters.brand === '' || task.brand === filters.brand)
    )
    setFilteredTasks(filtered)
  }, [tasks, searchTerm, filters])

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*')
    if (error) console.error('Error fetching tasks:', error)
    else setTasks(data)
  }

  const handleTaskAction = async (taskData) => {
    if (editingTask) {
      const { error } = await supabase.from('tasks').update(taskData).eq('id', editingTask.id)
      if (error) console.error('Error updating task:', error)
    } else {
      const { error } = await supabase.from('tasks').insert([taskData])
      if (error) console.error('Error adding task:', error)
    }
    fetchTasks()
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleDeleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) console.error('Error deleting task:', error)
    else fetchTasks()
  }

  const handleReorder = async (newOrder) => {
    setFilteredTasks(newOrder)
    // Here you would typically update the order in your database
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Taskaty</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <PlusCircle className="mr-2" />
          Add Task
        </Button>
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
        <Button onClick={() => {/* Open filter modal */}} className="flex items-center">
          <Filter className="mr-2" />
          Filters
        </Button>
      </div>

      <Reorder.Group as="ul" axis="y" values={filteredTasks} onReorder={handleReorder} className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <Reorder.Item key={task.id} value={task} as="li">
              <TaskCard
                task={task}
                onEdit={() => { setEditingTask(task); setIsModalOpen(true); }}
                onDelete={handleDeleteTask}
              />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(null); }}>
        <TaskForm
          initialData={editingTask}
          onSubmit={handleTaskAction}
          onCancel={() => { setIsModalOpen(false); setEditingTask(null); }}
        />
      </Modal>
    </div>
  )
}