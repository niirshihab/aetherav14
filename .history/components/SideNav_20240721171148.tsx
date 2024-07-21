'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PlusCircle, Menu } from 'lucide-react'

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

const SideNav: React.FC<SideNavProps> = ({ isCollapsed, toggleCollapse, setIsCollapsed }) => {
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
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={toggleCollapse}>
          <Menu size={24} />
        </button>
      </div>

      <nav className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-transparent via-transparent to-transparent`} style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}>
        <div className={`flex flex-col items-center justify-between h-full py-7 px-4 transition-all duration-300 ease-in-out`}>
          <div className="flex flex-col items-center w-full">
            <img src="/logo.png" alt="Aethera Logo" className={`h-[33px] w-[138px] mb-7 transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} />
            <div className="Line01 w-48 h-px opacity-5 bg-stone-700 mb-8" />
            <nav className="flex flex-col w-full items-center">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  onMouseEnter={() => {
                    if (item.name === 'Taskaty') setIsTaskatyHovered(true)
                    if (item.name === 'Salam') setIsSalamHovered(true)
                    setIsCollapsed(false)
                  }}
                  onMouseLeave={() => {
                    if (item.name === 'Taskaty') setIsTaskatyHovered(false)
                    if (item.name === 'Salam') setIsSalamHovered(false)
                    setIsCollapsed(true)
                  }}
                  className="relative w-full"
                >
                  <Link href={item.href} className={`sidebar-item w-full h-12 px-4 py-3 rounded-xl flex items-center gap-4 transition-colors ${pathname === item.href ? 'bg-[#B5413B] text-white' : 'bg-transparent text-black'}`}>
                    <img src={item.icon} alt={item.name} className="w-5 h-5" />
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
                          <button className="flex items-center p-2 text-blue-500 hover:bg-gray-100 w-full text-sm">
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
            </nav>
          </div>
        </div>
      </nav>
    </>
  )
}

export default SideNav