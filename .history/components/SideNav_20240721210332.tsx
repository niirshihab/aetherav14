import React, { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusCircle } from 'lucide-react'

// ... (previous imports and type definitions)

const SideNav: React.FC = () => {
  // ... (previous state declarations)
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const supabase = createClientComponentClient()
  const [boards, setBoards] = useState<any[]>([]) // Add the missing 'boards' state declaration
  const navItems: any[] = [] // Add the missing 'navItems' declaration

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoardName.trim()) return

    const { data, error } = await supabase
      .from('boards')
      .insert({ name: newBoardName })
      .select()

    if (error) {
      console.error('Error adding board:', error)
    } else {
      setBoards([...boards, data[0]])
      setNewBoardName('')
      setIsAddBoardModalOpen(false)
    }
  }

  return (
    <>
      {/* ... (previous JSX) */}
      
      <nav className={/* ... (previous className) */}>
        <div className={/* ... (previous className) */}>
          {/* ... (previous JSX) */}
          
          <nav className="flex flex-col w-full items-center">
            {navItems.map((item: any) => ( // Add type annotation for 'item' parameter
              <div key={item.name} /* ... (previous props) */>
                {/* ... (previous Link) */}
                
                {item.dropdown && (
                  <div className={/* ... (previous className) */}>
                    {item.name === 'Taskaty' ? (
                      <>
                        <h3 className="font-bold mb-2 text-sm text-black">Boards</h3>
                        {boards.map((board: any) => ( // Add type annotation for 'board' parameter
                          <Link 
                            key={board.id} 
                            href={`/taskaty/${board.id}`}
                            className="block p-2 text-sm text-black hover:bg-gray-100"
                          >
                            {board.name}
                          </Link>
                        ))}
                        <button 
                          className="flex items-center p-2 text-blue-500 hover:bg-gray-100 w-full text-sm"
                          onClick={() => setIsAddBoardModalOpen(true)}
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Add Board
                        </button>
                      </>
                    ) : (
                      // ... (Salam dropdown content)
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </nav>

      {/* Add Board Modal */}
      {isAddBoardModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add New Board</h2>
            <form onSubmit={handleAddBoard}>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Board Name"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddBoardModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default SideNav