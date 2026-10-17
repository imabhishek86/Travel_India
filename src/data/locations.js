// Initial demo locations for India travel map
// Reflects authentic demo data with varying availability of state and visit dates
export const DEFAULT_DEMO_LOCATIONS = [
  { id: 'demo-1', name: 'Delhi', lat: 28.6139, lng: 77.2090, stateName: '', lastVisited: '' },
  { id: 'demo-2', name: 'Mumbai', lat: 19.0760, lng: 72.8777, stateName: 'Maharashtra', lastVisited: '15 Jan 2026' },
  { id: 'demo-3', name: 'Goa', lat: 15.2993, lng: 74.1240, stateName: 'Goa', lastVisited: '10 Feb 2026' },
  { id: 'demo-4', name: 'Jaipur', lat: 26.9124, lng: 75.7873, stateName: 'Rajasthan', lastVisited: '28 Aug 2025' },
  { id: 'demo-5', name: 'Bengaluru', lat: 12.9716, lng: 77.5946, stateName: 'Karnataka', lastVisited: '05 Nov 2025' },
  { id: 'demo-6', name: 'Varanasi', lat: 25.3176, lng: 82.9739, stateName: 'Uttar Pradesh', lastVisited: '12 Dec 2025' },
  { id: 'demo-7', name: 'Kochi', lat: 9.9312, lng: 76.2673, stateName: 'Kerala', lastVisited: '20 Mar 2026' },
  { id: 'demo-8', name: 'Shimla', lat: 31.1048, lng: 77.1734, stateName: 'Himachal Pradesh', lastVisited: '' }
];

// Safe date parser to handle valid strings, human dates, empty dates, or invalid formats safely
export const parseVisitDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;
  const timestamp = Date.parse(trimmed);
  if (Number.isNaN(timestamp)) return null;
  const dateObj = new Date(timestamp);
  return {
    timestamp,
    year: dateObj.getFullYear(),
    displayDate: trimmed
  };
};
