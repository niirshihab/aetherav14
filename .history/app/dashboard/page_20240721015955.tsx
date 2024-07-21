// app/dashboard/page.tsx
import { Widget } from '@/components/Widget'
import { Button } from '@/components/Button'

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Widget title="Performance">
          <div className="w-80 h-20 justify-center items-center inline-flex">
            <div className="grow shrink basis-0 self-stretch justify-center items-center gap-2 inline-flex">
              <div className="w-40 h-20 justify-center items-center flex">
                <div className="grow shrink basis-0 self-stretch p-6 bg-brod-stone-50/5 rounded-2xl shadow border border-brod-rose-700 flex-col justify-center items-center gap-2 inline-flex">
                  <div className="h-16 justify-start items-center gap-1 inline-flex">
                    <img className="w-8 h-8" src="https://via.placeholder.com/32x32" alt="User" />
                    <div className="flex-col justify-start items-start gap-0.5 inline-flex">
                      <div className="text-gray-400 text-xs font-normal font-abeezee leading-none">My Points</div>
                      <div className="w-28 justify-start items-center gap-1 inline-flex">
                        <div className="text-brod-stone/60 text-xl font-normal font-abeezee leading-none">125 Points</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add Company's Average section here */}
            </div>
          </div>
          <div className="self-stretch h-10 pl-px justify-start items-center inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
              <div className="text-brod-stone/60 text-base font-normal font-abeezee leading-none">Top 3 Collectors</div>
            </div>
            {/* Add top 3 collectors images here */}
          </div>
          <Button>Preview your points collection details</Button>
        </Widget>

        {/* Example of another widget */}
        <Widget title="Tasks">
          {/* Add task-related content here */}
          <p className="text-brod-gray-500">Your upcoming tasks will be displayed here.</p>
        </Widget>

        {/* Add more widgets as needed */}
      </div>
    </div>
  )
}