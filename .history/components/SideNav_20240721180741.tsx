'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusCircle, Menu, X } from 'lucide-react'

type Board = {
  id: string
  name: string
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '/dashboard.svg' },
  { name: 'Taskaty', href: '/taskaty', icon: '/tablericonlistdetails.svg', dropdown: true },
  { name: 'BrodBank', href: '/brodbank', icon: '/tablericonsquareasterisk.svg' },
  { name: 'BrodGPT', href: '/brodgpt', icon: '/tablericonbrandopenai.svg' },
  { name: 'Salam', href: '/salam', icon: '/tablericonbrandcashapp.svg', dropdown: true },
  { name: 'Oops Moments', href: '/oops-moments', icon: '/tablericonmoodsmilebeam.svg' },
  { name: 'Mental Workout', href: '/mental-workout', icon: '/tablericonstretching.svg' },
  { name: 'MOM', href: '/mom', icon: '/tablericonbrandfinder.svg' },
  { name: 'B Points', href: '/b-points', icon: '/tablericonnumber.svg' },
]

const SideNav: React.FC = () => {
  const pathname = usePathname()
  const [boards, setBoards] = useState<Board[]>([])
  const [isTaskatyHovered, setIsTaskatyHovered] = useState(false)
  const [isSalamHovered, setIsSalamHovered] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    const { data, error } = await supabase
      .from('boards')
      .select('id, name')
    
    if (error) {
      console.error('Error fetching boards:', error)
      setError('Failed to fetch boards')
    } else {
      setBoards(data || [])
    }
  }

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newBoardName.trim()) {
      setError('Board name cannot be empty')
      return
    }

    const { data, error } = await supabase
      .from('boards')
      .insert({ name: newBoardName })
      .select()

    if (error) {
      console.error('Error adding board:', error)
      setError('Failed to add board')
    } else {
      setNewBoardName('')
      setIsAddBoardModalOpen(false)
      fetchBoards()
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between p-4 bg-white shadow-lg">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-lg font-bold">App Name</span>
      </div>

      <nav className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="w-64 bg-white shadow-lg">
          {/* Other nav items */}
          {navItems.map((item) => (
            <div
              key={item.name}
              onMouseEnter={() => item.name === 'Taskaty' ? setIsTaskatyHovered(true) : setIsSalamHovered(true)}
              onMouseLeave={() => item.name === 'Taskaty' ? setIsTaskatyHovered(false) : setIsSalamHovered(false)}
              className="relative"
            >
              <Link href={item.href} className={`flex items-center p-4 hover:bg-gray-100 ${pathname === item.href ? 'bg-gray-200' : ''}`}>
                <img src={item.icon} alt={item.name} className="mr-4" />
                <div className={`grow shrink basis-0 text-sm font-['ABeeZee'] leading-tight ${isCollapsed ? 'hidden' : 'block'}`}>
                  {item.name}
                </div>
              </Link>
              {item.dropdown && (
                <div className={`transition-all duration-500 ease-in-out transform ${item.name === 'Taskaty' ? (isTaskatyHovered ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0') : (isSalamHovered ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0')} overflow-hidden shadow-inner rounded-lg mt-1 p-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                  {item.name === 'Taskaty' ? (
                    <>
                      <h3 className="font-bold mb-2 text-sm text-black">Boards</h3>
                      {boards.map((board) => (
                        <Link 
                          key={board.id} 
                          href={`/taskaty/${board.id}`}
                          className="block p-2 text-sm text-black hover:bg-gray-100"
                        >
                          {board.name}
                        </Link>
                      ))}
                      <button 
                        onClick={() => setIsAddBoardModalOpen(true)} 
                        className="flex items-center p-2 text-blue-500 hover:bg-gray-100 w-full text-sm"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add Board
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/salam/hrops"
                      className="block p-2 text-sm text-black hover:bg-gray-100"
                    >
                      HROps
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {isAddBoardModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add New Board</h2>
            <form onSubmit={handleAddBoard}>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Board Name"
                className="w-full p-2 border rounded mb-4"
              />
              {error && <p className="text-red-500 mb-2">{error}</p>}
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