// components/AddBoard.tsx
'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import toast from 'react-hot-toast'

export const AddBoard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [boardName, setBoardName] = useState('')
  const supabase = createClientComponentClient()

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert([{ name: boardName }])
        .select()

      if (error) throw error

      toast.success('Board added successfully')
      setIsModalOpen(false)
      setBoardName('')
      // You might want to trigger a refresh of the board list in the parent component here
    } catch (error) {
      console.error('Error adding board:', error)
      toast.error('Failed to add board')
    }
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="w-full text-left pl-8 py-2 hover:bg-gray-100 text-blue-500 flex items-center">
        <PlusCircle size={16} className="mr-2" />
        Add Board
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleAddBoard} className="space-y-4">
          <h2 className="text-xl font-bold">Add New Board</h2>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="Board Name"
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Board</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}