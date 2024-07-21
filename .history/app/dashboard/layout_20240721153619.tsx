'use client'

import { useState } from 'react'
import SideNav from '@/components/SideNav'
import '../styles/globals.css'

export default function Layout({ children }) {
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