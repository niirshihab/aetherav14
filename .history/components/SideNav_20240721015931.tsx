// components/Sidebar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

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
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <>
        <button 
          className="lg:hidden fixed top-4 left-4 z-20"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition duration-200 ease-in-out lg:flex lg:flex-col w-64 bg-white shadow-lg z-10`}>
          <div className="p-4">
            <h1 className="text-2xl font-bold">Brodmann10</h1>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.name} className="px-4 py-2">
                <Link href={item.href} className="flex items-center space-x-2 text-black hover:text-brod-rose-700">
                  <span>{/* Add icon here */}</span>
                  <span>{item.name}</span>
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </>
    );
  };