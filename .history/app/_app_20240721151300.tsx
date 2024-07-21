import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import SideNav from '../components/SideNav'

function MyApp({ Component, pageProps }: AppProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div className="flex">
      <SideNav />
      <main className={`main-content ${isCollapsed ? 'main-content-collapsed' : 'main-content-expanded'}`}>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp