import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';

const LocationFilterPanel = (props) => {
  const {
    locations = [],
    filteredLocations = [],
    searchQuery = '',
    setSearchQuery,
    onClearFilters,
    isFilterActive = false,
  } = props;
  const containerRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Disable Leaflet map clicks and scroll events within the panel
  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
    if (mobileBtnRef.current) {
      L.DomEvent.disableClickPropagation(mobileBtnRef.current);
      L.DomEvent.disableScrollPropagation(mobileBtnRef.current);
    }
  }, [isExpanded, isMobileOpen]);

  const totalCount = locations.length;
  const matchCount = filteredLocations.length;

  const handleClearSearch = () => {
    if (setSearchQuery) setSearchQuery('');
    if (onClearFilters) onClearFilters();
  };

  return (
    <>
      {/* Mobile Trigger Button */}
      {!isMobileOpen && (
        <div ref={mobileBtnRef} className="md:hidden absolute bottom-20 left-4 z-[1000]">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="bg-white/95 backdrop-blur-sm border border-stone-300 text-stone-800 px-3.5 py-2 rounded-xl shadow-md font-sans text-xs font-semibold flex items-center gap-2 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Open filter and locations panel"
          >
            <span className="text-sm">📍</span>
            <span>Locations</span>
            <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {matchCount}/{totalCount}
            </span>
            {isFilterActive && (
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" title="Active filters"></span>
            )}
          </button>
        </div>
      )}

      {/* Main Filter & Locations Panel */}
      <div
        ref={containerRef}
        className={`z-[1001] font-sans transition-all duration-200 ${
          isMobileOpen
            ? 'fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm rounded-t-2xl border-t border-stone-200 shadow-2xl p-3.5 flex flex-col md:hidden'
            : 'hidden md:flex flex-col absolute top-[76px] left-4 w-[280px] lg:w-[300px]'
        }`}
      >
        <div className={`${isMobileOpen ? '' : 'bg-white/95 backdrop-blur-sm border border-stone-200 rounded-xl shadow-md'} overflow-hidden flex flex-col`}>
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">📍</span>
              <h2 className="font-serif font-bold text-stone-800 text-sm tracking-tight">
                Travel Locations
              </h2>
              <span className="bg-stone-200/80 text-stone-700 text-[11px] font-semibold px-2 py-0.5 rounded-full leading-none">
                {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Desktop Collapse / Expand Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:inline-flex text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                title={isExpanded ? "Collapse panel" : "Expand panel"}
                aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
              >
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden text-stone-500 hover:text-stone-800 p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          {isExpanded && (
            <div className="p-3 flex flex-col gap-2">
              {/* Search by location name */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Filter by location name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-stone-400 focus:bg-white transition-all font-sans"
                  aria-label="Filter locations by name"
                />
                <svg
                  className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 text-stone-400 hover:text-stone-700 text-xs p-0.5 rounded cursor-pointer"
                    title="Clear search text"
                    aria-label="Clear search text"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Small result count */}
              <div className="text-xs text-stone-600 font-medium px-0.5">
                Showing {matchCount} {matchCount === 1 ? 'location' : 'locations'}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LocationFilterPanel;
