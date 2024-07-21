'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Subtask = {
  id: string
  name: string
  is_completed: boolean
}

type SubtaskListProps = {
  taskId: string
}

export const SubtaskList: React.FC<SubtaskListProps> = ({ taskId }) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [newSubtaskName, setNewSubtaskName] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchSubtasks()
  }, [taskId])

  const fetchSubtasks = async () => {
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .eq('task_id', taskId)

    if (error) {
      console.error('Error fetching subtasks:', error)
    } else {
      setSubtasks(data || [])
    }
  }

  const addSubtask = async () => {
    if (!newSubtaskName.trim()) return

    const { error } = await supabase
      .from('subtasks')
      .insert({ task_id: taskId, name: newSubtaskName })

    if (error) {
      console.error('Error adding subtask:', error)
    } else {
      setNewSubtaskName('')
      fetchSubtasks()
    }
  }

  const toggleSubtask = async (subtaskId: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from('subtasks')
      .update({ is_completed: isCompleted })
      .eq('id', subtaskId)

    if (error) {
      console.error('Error updating subtask:', error)
    } else {
      fetchSubtasks()
    }
  }

  const deleteSubtask = async (subtaskId: string) => {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', subtaskId)

    if (error) {
      console.error('Error deleting subtask:', error)
    } else {
      fetchSubtasks()
    }
  }

  return (
    <div className="mt-2">
      <h4 className="font-bold">Subtasks</h4>
      <ul>
        {subtasks.map(subtask => (
          <li key={subtask.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={subtask.is_completed}
              onChange={() => toggleSubtask(subtask.id, !subtask.is_completed)}
            />
            <span className={subtask.is_completed ? 'line-through' : ''}>{subtask.name}</span>
            <button onClick={() => deleteSubtask(subtask.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex">
        <input
          type="text"
          value={newSubtaskName}
          onChange={(e) => setNewSubtaskName(e.target.value)}
          placeholder="New subtask"
          className="border rounded p-1 flex-grow"
        />
        <button onClick={addSubtask} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">Add</button>
      </div>
    </div>
  )
}