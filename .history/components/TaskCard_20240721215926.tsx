import React from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Clock } from 'lucide-react'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    priority: string
    status: string
    due_date: string
    leeway: string
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
      {/* ... (previous content) */}
      <div className="mt-2 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
        <Clock size={16} className="mr-1" />
        Leeway: {task.leeway}
      </div>
    </motion.div>
  )
}