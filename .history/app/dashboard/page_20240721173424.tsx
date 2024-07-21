// app/dashboard/page.tsx
import { Widget } from '@/components/Widget'
import { Button } from '@/components/Button';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <Widget title="Performance">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-4 bg-brod-stone-50/5 rounded-2xl shadow border border-brod-rose-700">
                <div className="flex items-center gap-2">
                  <img className="w-8 h-8" src="https://via.placeholder.com/32x32" alt="User" />
                  <div>
                    <div className="text-gray-400 text-xs font-normal font-abeezee">My Points</div>
                    <div className="text-brod-stone/60 text-xl font-normal font-abeezee">125 Points</div>
                  </div>
                </div>
              </div>
              {/* Add Company's Average section here */}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-brod-stone/60 text-base font-normal font-abeezee">Top 3 Collectors</div>
              {/* Add top 3 collectors images here */}
            </div>
            <Button>Preview your points collection details</Button>
          </div>
        </Widget>

        <Widget title="Tasks">
          <p className="text-brod-gray-500">Your upcoming tasks will be displayed here.</p>
        </Widget>

        {/* Add more widgets as needed */}
      </div>
    </div>
  )
}