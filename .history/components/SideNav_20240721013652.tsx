'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Taskaty', href: '/dashboard/taskaty' },
  { name: 'Salam', href: '/dashboard/salam' },
  { name: 'Brodbank', href: '/dashboard/brodbank' },
  { name: 'BrodGPT', href: '/dashboard/brodgpt' },
  { name: 'MOM', href: '/dashboard/mom' },
  { name: 'B Points', href: '/dashboard/bpoints' },
  { name: 'Oops Moments', href: '/dashboard/oops' },
  { name: 'Mental Workouts', href: '/dashboard/mental-workouts' },
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Brodmann10</h1>
      </div>
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`block p-4 hover:bg-gray-100 ${
                pathname === item.href ? 'bg-gray-200' : ''
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}