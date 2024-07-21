'use client'

import '../../styles/globals.css' // Ensure this path is correct
import { useState } from 'react'
import SideNav from '@/components/SideNav'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`app-container ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <SideNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}