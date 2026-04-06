export interface Region {
  key: string;
  label: string;
  flag: string;
  currency: string;
  locale: string;
}

export const REGIONS: Region[] = [
  { key: 'india', label: 'India', flag: '🇮🇳', currency: 'INR', locale: 'en-IN' },
  { key: 'uk', label: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', locale: 'en-GB' },
];

export const getRegion = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('region') || 'india';
  }
  return 'india';
};

export const setRegion = (regionKey: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('region', regionKey);
    // Dispatch a custom event to notify components about the region change
    window.dispatchEvent(new CustomEvent('region-change', { detail: regionKey }));
  }
};

export const getRegionConfig = (): Region => {
  const currentKey = getRegion();
  return REGIONS.find((r) => r.key === currentKey) || REGIONS[0];
};
