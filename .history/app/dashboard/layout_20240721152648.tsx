import '../styles/globals.css'
import { useState } from 'react'
import SideNav from '@/components/SideNav'

import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
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