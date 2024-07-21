'use client'

import React, { useState } from 'react';
import Link from 'next/link';

export const TopBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center gap-5">
            <div className="TopBarLineSeperator w-10 h-px origin-top-left rotate-90 border border-gray-500 hidden sm:block"></div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brod-rose-700"
              >
                <div className="MaskGroup w-12 h-12 relative">
                  <img className="TopBarProfileDropdown w-12 h-12 left-0 top-0 absolute rounded-full" src="https://via.placeholder.com/49x49" alt="Profile" />
                  <img className="UnsplashIeebwgy6la w-14 h-14 left-[-3.11px] top-0 absolute" src="https://via.placeholder.com/55x55" alt="Profile Background" />
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-neutral-100 rounded-xl shadow border border-white/70">
                  <div className="px-7 py-7">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="MaskGroup w-11 h-11 relative">
                        <img className="w-11 h-11 left-0 top-0 absolute rounded-full" src="https://via.placeholder.com/45x45" alt="Profile" />
                        <img className="w-14 h-14 left-[-5px] top-0 absolute" src="https://via.placeholder.com/55x55" alt="Profile Background" />
                      </div>
                      <div className="flex-col">
                        <div className="text-black text-base font-bold font-['Inter'] leading-normal">James Smith</div>
                        <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-normal">Graphic Designer</div>
                      </div>
                    </div>
                    <div className="h-px opacity-25 bg-stone-700 rounded-2xl mb-4"></div>
                    <Link href="/settings" className="block px-5 py-4 rounded-xl text-black text-sm font-normal font-['ABeeZee'] leading-tight hover:bg-gray-200">Settings</Link>
                    <Link href="/logout" className="block px-5 py-4 rounded-xl text-black text-sm font-normal font-['ABeeZee'] leading-tight hover:bg-gray-200">Logout</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};