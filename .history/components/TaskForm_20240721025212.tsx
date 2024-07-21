// components/TaskForm.tsx
import React, { useState } from 'react'
import { Button } from '@/components/Button'

interface TaskFormProps {
  initialData?: {
    title: string
    description: string
    priority: string
    status: string
    due_date: string
  }
  onSubmit: (taskData: TaskFormProps['initialData']) => void
  onCancel: () => void
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [taskData, setTaskData] = useState(initialData || {
    title: '',
    description: '',
    priority: '',
    status: '',
    due_date: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTaskData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(taskData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Description</label>
        <textarea
          id="description"
          name="description"
          value={taskData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Priority</label>
        <select
          id="priority"
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white sm:text-sm"
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Status</label>
        <select
          id="status"
          name="status"
          value={taskData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white sm:text-sm"
        >
          <option value="">Select status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">Due Date</label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          value={taskData.due_date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}