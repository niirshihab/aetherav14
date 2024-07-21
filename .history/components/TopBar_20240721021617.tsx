'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react'; // Assuming you're using lucide-react for icons

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
                  <img className="UnsplashIeebwgy6la w-14 h-14 left-[-3.11px] top-0 absolute" src="public/collaborator1.png" alt="Profile Background" />
                </div>
              </button>
              {isDropdownOpen && (
                <div className="UpperBar w-60 h-56 px-7 py-7 bg-neutral-100 rounded-xl shadow border border-white/70 flex-col justify-start items-start gap-4 inline-flex absolute right-0 mt-2">
                  <div className="Sidebar h-44 flex-col justify-start items-center gap-0.5 flex">
                    <div className="Avatars h-14 px-8 py-5 justify-center items-center gap-2.5 inline-flex">
                      <div className="MaskGroup w-11 h-11 relative">
                        <img className="Ellipse1 w-11 h-11 left-0 top-0 absolute rounded-full" src="https://via.placeholder.com/45x45" alt="Profile" />
                        <img className="UnsplashIeebwgy6la w-14 h-14 left-[-5px] top-0 absolute" src="https://via.placeholder.com/55x55" alt="Profile Background" />
                      </div>
                      <div className="Text flex-col justify-start items-start inline-flex">
                        <div className="JamesSmith self-stretch text-black text-base font-bold font-['Inter'] leading-normal">James Smith</div>
                        <div className="GraphicDesigner self-stretch text-gray-500 text-xs font-normal font-['Inter'] leading-normal">Graphic Designer</div>
                      </div>
                    </div>
                    <div className="Line01 self-stretch h-px opacity-25 bg-stone-700 rounded-2xl" />
                    <div className="Main rounded-2xl flex-col justify-start items-start gap-1 flex">
                      <div className="List h-28 flex-col justify-start items-center flex">
                        <Link href="/settings" className="self-stretch px-5 py-4 rounded-xl justify-start items-center gap-4 inline-flex hover:bg-gray-200">
                          <Settings className="w-6 h-6" />
                          <div className="Settings grow shrink basis-0 text-black text-sm font-normal font-['ABeeZee'] leading-tight">Settings</div>
                        </Link>
                        <Link href="/logout" className="self-stretch px-5 py-4 rounded-xl justify-start items-center gap-4 inline-flex hover:bg-gray-200">
                          <LogOut className="w-6 h-6" />
                          <div className="Logout grow shrink basis-0 text-black text-sm font-normal font-['ABeeZee'] leading-tight">Logout</div>
                        </Link>
                      </div>
                    </div>
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