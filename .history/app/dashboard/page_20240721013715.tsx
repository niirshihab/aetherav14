// app/dashboard/layout.tsx
import SideNav from '@/components/SideNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  )
}