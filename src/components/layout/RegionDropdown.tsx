"use client";

import React, { useState, useRef, useEffect } from 'react';
import { REGIONS } from '@/lib/region';
import { useRegion } from './RegionContext';
import { Check, ChevronDown } from 'lucide-react';

const RegionDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { region, regionConfig, changeRegion } = useRegion();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (regionKey: string) => {
    changeRegion(regionKey);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          id="region-menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span className="mr-2 text-lg">{regionConfig.flag}</span>
          <span className="hidden sm:inline">{regionConfig.label}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="region-menu-button"
        >
          <div className="py-1" role="none">
            {REGIONS.map((r) => (
              <button
                key={r.key}
                onClick={() => handleSelect(r.key)}
                className={`${
                  region === r.key ? 'bg-gray-50 text-red-600 font-semibold' : 'text-gray-700'
                } group flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-red-50 transition-colors duration-150`}
                role="menuitem"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl">{r.flag}</span>
                  <span>{r.label}</span>
                </div>
                {region === r.key && (
                  <Check className="h-4 w-4 text-red-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionDropdown;
