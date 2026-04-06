"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getRegion, setRegion as saveRegion, getRegionConfig, Region } from '@/lib/region';

interface RegionContextType {
  region: string;
  regionConfig: Region;
  changeRegion: (regionKey: string) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<string>('india');
  const [regionConfig, setRegionConfig] = useState<Region>(getRegionConfig());

  useEffect(() => {
    // Initial sync with localStorage
    const currentRegion = getRegion();
    if (currentRegion !== region) {
      requestAnimationFrame(() => {
        setRegionState(currentRegion);
        setRegionConfig(getRegionConfig());
      });
    }

    const handleRegionChange = (event: CustomEvent<string>) => {
      const newRegion = event.detail;
      setRegionState(newRegion);
      setRegionConfig(getRegionConfig());
    };

    window.addEventListener('region-change', handleRegionChange as EventListener);
    return () => {
      window.removeEventListener('region-change', handleRegionChange as EventListener);
    };
  }, [region]);

  const changeRegion = (regionKey: string) => {
    saveRegion(regionKey);
    setRegionState(regionKey);
    setRegionConfig(getRegionConfig());
  };

  return (
    <RegionContext.Provider value={{ region, regionConfig, changeRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
