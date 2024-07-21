// /mnt/data/SideNav.tsx
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

const SideNav: React.FC = () => {
  const pathname = usePathname()
  const [boards, setBoards] = useState<Board[]>([])
  const [isTaskatyHovered, setIsTaskatyHovered] = useState(false)
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
      <Link href="/" className={`block p-4 hover:bg-gray-100 ${pathname === '/' ? 'bg-gray-200' : ''}`}>
        Home
      </Link>
      <Link href="/about" className={`block p-4 hover:bg-gray-100 ${pathname === '/about' ? 'bg-gray-200' : ''}`}>
        About
      </Link>
      {/* Taskaty Section */}
      <div
        onMouseEnter={() => setIsTaskatyHovered(true)}
        onMouseLeave={() => setIsTaskatyHovered(false)}
        className="relative"
      >
        <Link href="/taskaty" className={`block p-4 hover:bg-gray-100 ${pathname === '/taskaty' ? 'bg-gray-200' : ''}`}>
          Taskaty
        </Link>
        {isTaskatyHovered && (
          <div className="absolute left-full top-0 bg-white shadow-lg rounded-r-lg p-2">
            <h3 className="font-bold mb-2">Boards</h3>
            {boards.map((board) => (
              <Link 
                key={board.id} 
                href={`/taskaty/${board.id}`}
                className="block p-2 hover:bg-gray-100"
              >
                {board.name}
              </Link>
            ))}
            <button className="flex items-center p-2 text-blue-500 hover:bg-gray-100 w-full">
              <PlusCircle size={16} className="mr-2" />
              Add Board
            </button>
          </div>
        )}
      </div>
      <Link href="/contact" className={`block p-4 hover:bg-gray-100 ${pathname === '/contact' ? 'bg-gray-200' : ''}`}>
        Contact
      </Link>
      {/* Other nav items */}
    </nav>
  )
}

export default SideNav;