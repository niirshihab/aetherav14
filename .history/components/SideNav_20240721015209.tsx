// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard-icon' },
  { name: 'Taskaty', href: '/taskaty', icon: 'taskaty-icon', dropdown: true },
  { name: 'BrodBank', href: '/brodbank', icon: 'brodbank-icon' },
  { name: 'BrodGPT', href: '/brodgpt', icon: 'brodgpt-icon' },
  { name: 'Salam', href: '/salam', icon: 'salam-icon', dropdown: true },
  { name: 'Oops Moments', href: '/oops-moments', icon: 'oops-moments-icon' },
  { name: 'Mental Workout', href: '/mental-workout', icon: 'mental-workout-icon' },
  { name: 'MOM', href: '/mom', icon: 'mom-icon' },
  { name: 'B Points', href: '/b-points', icon: 'b-points-icon' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-96 relative">
      <div className="h-96 left-[24px] top-[147px] absolute flex-col justify-start items-center inline-flex">
        {navItems.map((item) => (
          <div key={item.name} className="self-stretch px-5 py-4 rounded-xl justify-start items-center gap-4 inline-flex">
            <div className={`w-6 h-6 relative ${item.icon}`} />
            <Link href={item.href} className="grow shrink basis-0 text-black text-sm font-normal font-abeezee leading-tight">
              {item.name}
            </Link>
            {item.dropdown && (
              <div className="w-6 h-6 relative origin-top-left -rotate-90 rounded-3xl" />
            )}
          </div>
        ))}
      </div>
      <div className="w-64 h-px left-0 top-[130px] absolute opacity-25 bg-brod-stone" />
      <div className="w-36 h-8 left-[60px] top-[62px] absolute">
        {/* Add your logo here */}
      </div>
    </div>
  );
};