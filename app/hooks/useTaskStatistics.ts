// hooks/useTaskStatistics.ts
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const useTaskStatistics = () => {
  const [tasksByStatus, setTasksByStatus] = useState([])
  const [tasksByPriority, setTasksByPriority] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchStatistics = async () => {
      const { data, error } = await supabase.from('tasks').select('status, priority')
      
      if (error) {
        console.error('Error fetching task statistics:', error)
        return
      }

      const statusCounts = data.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, {})

      const priorityCounts = data.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      }, {})

      setTasksByStatus(Object.entries(statusCounts).map(([name, value]) => ({ name, value })))
      setTasksByPriority(Object.entries(priorityCounts).map(([name, value]) => ({ name, value })))
    }

    fetchStatistics()
  }, [supabase])

  return { tasksByStatus, tasksByPriority }
}