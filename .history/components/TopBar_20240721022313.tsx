'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, LogOut } from 'lucide-react';

export const TopBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("TopBar mounted");
    return () => console.log("TopBar unmounted");
  }, []);

  const toggleDropdown = () => {
    console.log("Toggling dropdown");
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center gap-5">
            <div className="TopBarLineSeperator w-10 h-px origin-top-left rotate-90 border border-gray-500 hidden sm:block"></div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brod-rose-700"
              >
                <div className="MaskGroup w-12 h-12 relative">
                  <Image
                    src="/collaborator1.png"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="rounded-full"
                    onError={() => console.error("Failed to load profile image")}
                  />
                </div>
              </button>
              {isDropdownOpen && (
                <div className="UpperBar w-60 h-56 px-7 py-7 bg-neutral-100 rounded-xl shadow border border-white/70 flex-col justify-start items-start gap-4 inline-flex absolute right-0 mt-2 z-10">
                  <div className="Sidebar h-44 flex-col justify-start items-center gap-0.5 flex">
                    <div className="Avatars h-14 px-8 py-5 justify-center items-center gap-2.5 inline-flex">
                      <div className="MaskGroup w-11 h-11 relative">
                        <Image
                          src="/collaborator1.png"
                          alt="Profile"
                          width={44}
                          height={44}
                          className="rounded-full"
                          onError={() => console.error("Failed to load profile image in dropdown")}
                        />
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