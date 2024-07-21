'use client'

import { useState } from 'react'
import SideNav from '@/components/SideNav'
import '../../styles/globals.css'  // Adjusted path based on the directory structure

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