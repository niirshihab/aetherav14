// app/dashboard/page.tsx
import { Sidebar } from '@/components/SideNav';
import { Widget } from '@/components/Widget'

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Widget title="Widget Title" children="Widget Content" />
          {/* Add other widgets here */}
        </div>
      </main>
    </div>
  );
}