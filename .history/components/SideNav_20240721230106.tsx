'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusCircle, Menu, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

interface SideNavProps {
  isCollapsed: boolean
  toggleCollapse: () => void
}

const SideNav: React.FC<SideNavProps> = ({ isCollapsed, toggleCollapse }) => {
  const pathname = usePathname()
  const [boards, setBoards] = useState<Board[]>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchBoards = async () => {
      const { data, error } = await supabase
        .from('boards')
        .select('id, name')
      
      if (error) {
        console.error('Error fetching boards:', error)
      } else {
        setBoards(data || [])
      }
    }

    fetchBoards()
  }, [supabase])

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
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleCollapse}>
          {isCollapsed ? <Menu /> : <X />}
        </Button>
      </div>

      <nav className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white shadow-lg`}>
        <div className={`flex flex-col items-center justify-between h-full py-7 px-4 transition-all duration-300 ease-in-out`}>
          <div className="flex flex-col items-center w-full">
            <img src="/logo.png" alt="Aethera Logo" className={`h-[33px] w-[138px] mb-7 transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} />
            <div className="w-48 h-px opacity-5 bg-stone-700 mb-8" />
            <nav className="flex flex-col w-full items-center space-y-2">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative w-full"
                >
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
                    onClick={() => {
                      if (item.dropdown) {
                        setExpandedItem(expandedItem === item.name ? null : item.name)
                      }
                    }}
                  >
                    <img src={item.icon} alt={item.name} className="w-5 h-5 mr-2" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Button>
                  {item.dropdown && expandedItem === item.name && !isCollapsed && (
                    <div className="ml-6 mt-2 space-y-2">
                      {item.name === 'Taskaty' ? (
                        <>
                          {boards.map((board) => (
                            <Link 
                              key={board.id} 
                              href={`/taskaty/${board.id}`}
                              className="block p-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                              {board.name}
                            </Link>
                          ))}
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-blue-500"
                            onClick={() => setIsAddBoardModalOpen(true)}
                          >
                            <PlusCircle size={16} className="mr-2" />
                            Add Board
                          </Button>
                        </>
                      ) : (
                        <Link 
                          href="/salam/hrops"
                          className="block p-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                          HROps
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </nav>

      <Dialog open={isAddBoardModalOpen} onOpenChange={setIsAddBoardModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Board</DialogTitle>
            <DialogDescription>
              Enter a name for your new board below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBoard} className="space-y-4">
            <Input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board Name"
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsAddBoardModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SideNav