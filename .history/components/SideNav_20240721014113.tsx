'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp, Menu } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard-icon' },
  {
    name: 'Taskaty',
    icon: 'taskaty-icon',
    dropdown: [
      { name: 'Tasks', href: '/dashboard/taskaty' },
      { name: 'Add a Brand', href: '/dashboard/taskaty/add-brand' }
    ]
  },
  {
    name: 'Salam',
    icon: 'salam-icon',
    dropdown: [
      { name: 'HR Dashboard', href: '/dashboard/salam' },
      { name: 'HROps', href: '/dashboard/salam/hrops' }
    ]
  },
  { name: 'Brodbank', href: '/dashboard/brodbank', icon: 'brodbank-icon' },
  { name: 'BrodGPT', href: '/dashboard/brodgpt', icon: 'brodgpt-icon' },
  { name: 'MOM', href: '/dashboard/mom', icon: 'mom-icon' },
  { name: 'B Points', href: '/dashboard/bpoints', icon: 'bpoints-icon' },
  { name: 'Oops Moments', href: '/dashboard/oops', icon: 'oops-icon' },
  { name: 'Mental Workouts', href: '/dashboard/mental-workouts', icon: 'mental-workouts-icon' },
]

export default function SideNav() {
  const pathname = usePathname()
  const [isMinimized, setIsMinimized] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <nav className={`bg-white shadow-lg transition-all ${isMinimized ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!isMinimized && <h1 className="text-2xl font-bold">Brodmann10</h1>}
        <button onClick={() => setIsMinimized(!isMinimized)} className="p-2">
          <Menu size={24} />
        </button>
      </div>
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            {item.dropdown ? (
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-100`}
                >
                  <span className={`flex items-center ${isMinimized ? 'justify-center' : ''}`}>
                    {/* Replace with actual icon component */}
                    <span className="mr-2">{item.icon}</span>
                    {!isMinimized && item.name}
                  </span>
                  {!isMinimized && (openDropdown === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </button>
                {openDropdown === item.name && !isMinimized && (
                  <ul className="bg-gray-50 py-2">
                    {item.dropdown.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`block pl-12 py-2 hover:bg-gray-100 ${
                            pathname === subItem.href ? 'bg-gray-200' : ''
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center p-4 hover:bg-gray-100 ${
                  pathname === item.href ? 'bg-gray-200' : ''
                } ${isMinimized ? 'justify-center' : ''}`}
              >
                {/* Replace with actual icon component */}
                <span className="mr-2">{item.icon}</span>
                {!isMinimized && item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}