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
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBoardData()
  }, [params.boardId])

  const fetchBoardData = async () => {
    // Fetch board name
    const { data: boardData, error: boardError } = await supabase
      .from('boards')
      .select('name')
      .eq('id', params.boardId)
      .single()

    if (boardError) {
      console.error('Error fetching board:', boardError)
    } else if (boardData) {
      setBoardName(boardData.name)
    }

    // Fetch tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('board_id', params.boardId)

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
    } else {
      setTasks(tasksData || [])
    }
  }

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task status:', error)
    } else {
      fetchBoardData()  // Refresh tasks after update
    }
  }

  const uncompletedTasks = tasks.filter(task => task.status !== 'Done')
  const completedTasks = tasks.filter(task => task.status === 'Done')

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{boardName}</h1>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Uncompleted Tasks</h2>
        <KanbanBoard tasks={uncompletedTasks} onTaskMove={handleTaskMove} />
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