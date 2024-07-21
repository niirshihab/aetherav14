import { Notifications } from '@/components/Notifications'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Taskaty</h1>
            <Notifications />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}