'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusCircle } from 'lucide-react'

type Board = {
  id: string
  name: string
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard-icon' },
  { name: 'Taskaty', href: '/taskaty', icon: 'taskaty-icon', dropdown: true },
  { name: 'BrodBank', href: '/brodbank', icon: 'brodbank-icon' },
  { name: 'BrodGPT', href: '/brodgpt', icon: 'brodgpt-icon' },
  { name: 'Salam', href: '/salam', icon: 'salam-icon', dropdown: true },
  { name: 'Oops Moments', href: '/oops-moments', icon: 'oops-moments-icon' },
  { name: 'Mental Workout', href: '/mental-workout', icon: 'mental-workout-icon' },
  { name: 'MOM', href: '/mom', icon: 'mom-icon' },
  { name: 'B Points', href: '/b-points', icon: 'b-points-icon' },
]

export const SideNav: React.FC = () => {
  const pathname = usePathname()
  const [boards, setBoards] = useState<Board[]>([])
  const [isTaskatyHovered, setIsTaskatyHovered] = useState(false)
  const [isSalamHovered, setIsSalamHovered] = useState(false)
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

  return (
    <nav className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <img src="/logo.png" alt="Aethera Logo" className="h-8 mx-auto" />
      </div>
      {navItems.map((item) => (
        <div
          key={item.name}
          onMouseEnter={() => {
            if (item.name === 'Taskaty') setIsTaskatyHovered(true)
            if (item.name === 'Salam') setIsSalamHovered(true)
          }}
          onMouseLeave={() => {
            if (item.name === 'Taskaty') setIsTaskatyHovered(false)
            if (item.name === 'Salam') setIsSalamHovered(false)
          }}
          className="relative"
        >
          <Link href={item.href} className={`block p-4 hover:bg-gray-100 ${pathname === item.href ? 'bg-gray-200' : ''}`}>
            <span className={item.icon}></span> {item.name}
          </Link>
          {item.name === 'Taskaty' && (
            <div className={`transition-all duration-300 ease-in-out ${isTaskatyHovered ? 'max-h-screen' : 'max-h-0'} overflow-hidden bg-white shadow-inner rounded-lg mt-1 p-2`}>
              <h3 className="font-bold mb-2 text-sm">Boards</h3>
              {boards.map((board) => (
                <Link 
                  key={board.id} 
                  href={`/taskaty/${board.id}`}
                  className="block p-2 text-sm hover:bg-gray-100"
                >
                  {board.name}
                </Link>
              ))}
              <button className="flex items-center p-2 text-blue-500 hover:bg-gray-100 w-full text-sm">
                <PlusCircle size={16} className="mr-2" />
                Add Board
              </button>
            </div>
          )}
          {item.name === 'Salam' && (
            <div className={`transition-all duration-300 ease-in-out ${isSalamHovered ? 'max-h-screen' : 'max-h-0'} overflow-hidden bg-white shadow-inner rounded-lg mt-1 p-2`}>
              <Link 
                href="/salam/hrops"
                className="block p-2 text-sm hover:bg-gray-100"
              >
                HROps
              </Link>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

export default SideNav