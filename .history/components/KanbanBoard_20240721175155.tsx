'use client'

import React from 'react'
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
}

const columns = ['To Do', 'In Progress', 'Up Next']

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove }) => {
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newStatus = destination.droppableId
    onTaskMove(draggableId, newStatus)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {columns.map(column => (
          <div key={column} className="flex-1">
            <h3 className="font-bold mb-2">{column}</h3>
            <Droppable droppableId={column}>
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-2 rounded min-h-[200px]"
                >
                  {tasks
                    .filter(task => task.status === column)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 mb-2 rounded shadow"
                          >
                            <h4 className="font-bold">{task.name}</h4>
                            <p>Priority: {task.priority}</p>
                            <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
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