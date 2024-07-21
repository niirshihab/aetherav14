'use client'

import { useState } from 'react'
import SideNav from '@/components/SideNav'
import { TopBar } from '@/components/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex flex-1">
        <SideNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
        <main className={`flex-1 overflow-y-auto p-4 lg:p-8 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}