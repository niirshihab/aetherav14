'use client'

import React, { useState } from 'react';
import Link from 'next/link';

export const TopBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            {/* Add your logo or brand name here */}
            <span className="text-xl font-bold">Brodmann10</span>
          </div>
          <div className="ml-4 flex items-center">
            <div className="TopBarLineSeperator w-10 h-px origin-top-left rotate-90 border border-gray-500 hidden sm:block"></div>
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brod-rose-700"
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://via.placeholder.com/49x49"
                    alt="Profile"
                  />
                </button>
              </div>
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-900">James Smith</p>
                    <p className="text-sm text-gray-500">Graphic Designer</p>
                  </div>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                  <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};