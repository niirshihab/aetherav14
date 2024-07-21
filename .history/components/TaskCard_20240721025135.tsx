// components/TaskCard.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    priority: string
    status: string
    due_date: string
  }
  onEdit: (task: TaskCardProps['task']) => void
  onDelete: (id: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{task.title}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{task.description}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(task)} className="text-blue-500 hover:text-blue-600 transition-colors">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-600 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          task.priority === 'high' ? 'bg-red-100 text-red-800' :
          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.status}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  )
}