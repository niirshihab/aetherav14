'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

type Task = {
  id: string
  name: string
  status: string
  priority: string
  due_date: string
}

type KanbanBoardProps = {
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: string) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
}

const columns = ['To Do', 'In Progress', 'Up Next']

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove, onTaskUpdate }) => {
  const [editingTask, setEditingTask] = useState<string | null>(null)

  const onDragEnd = (result: DropResult) => {
    // ... (previous onDragEnd implementation)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id)
  }

  const handleSaveTask = (task: Task, updates: Partial<Task>) => {
    onTaskUpdate(task.id, updates)
    setEditingTask(null)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {columns.map(column => (
          <div key={column} className="flex-1">
            <h3 className="font-bold mb-2">{column}</h3>
            <Droppable droppableId={column}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-2 rounded min-h-[200px]"
                >
                  {tasks
                    .filter(task => task.status === column)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 mb-2 rounded shadow"
                          >
                            {editingTask === task.id ? (
                              <TaskEditForm
                                task={task}
                                onSave={(updates) => handleSaveTask(task, updates)}
                                onCancel={() => setEditingTask(null)}
                              />
                            ) : (
                              <div onClick={() => handleEditTask(task)}>
                                <h4 className="font-bold">{task.name}</h4>
                                <p>Priority: {task.priority}</p>
                                <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

type TaskEditFormProps = {
  task: Task
  onSave: (updates: Partial<Task>) => void
  onCancel: () => void
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({ task, onSave, onCancel }) => {
  const [name, setName] = useState(task.name)
  const [priority, setPriority] = useState(task.priority)
  const [dueDate, setDueDate] = useState(task.due_date)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, priority, due_date: dueDate })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-1 border rounded"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-1 border rounded"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-1 border rounded"
      />
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-2 py-1 bg-gray-200 rounded">
          Cancel
        </button>
        <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded">
          Save
        </button>
      </div>
    </form>
  )
}