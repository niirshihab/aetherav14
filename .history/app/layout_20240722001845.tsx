import '../styles/globals.css'
import { Inter } from 'next/font/google'
import SideMenu from '../components/SideNav'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <SideMenu />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}