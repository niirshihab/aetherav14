import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import SideNav from '../components/SideNav'

function MyApp({ Component, pageProps }: AppProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`app-container ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <SideNav isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main className="main-content p-4">
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp