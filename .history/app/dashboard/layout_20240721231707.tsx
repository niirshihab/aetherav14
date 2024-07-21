'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PlusCircle, Menu, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Board = {
  id: string
  name: string
  created_at: string
  user_id: string
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
  
  // Initialize Supabase client
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
    if (error) console.error(error)
    else setBoards(data)
  }

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = supabase.auth.user()
    if (user) {
      const { data, error } = await supabase
        .from('boards')
        .insert([{ name: newBoardName, user_id: user.id }])
      if (error) console.error(error)
      else {
        setBoards([...boards, { id: data[0].id, name: newBoardName, created_at: data[0].created_at, user_id: user.id }])
        setNewBoardName('')
        setIsAddBoardModalOpen(false)
      }
    } else {
      console.error('User not authenticated')
    }
  }

  return (
    <>
      <nav>
        {/* Your existing navigation code */}
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-500"
          onClick={() => setIsAddBoardModalOpen(true)}
        >
          <PlusCircle size={16} className="mr-2" />
          Add Board
        </Button>
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