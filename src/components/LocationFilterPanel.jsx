import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

const LocationFilterPanel = ({
  locations,
  filteredLocations,
  selectedLocation,
  onSelectLocation,
  searchQuery,
  setSearchQuery,
  selectedState,
  setSelectedState,
  availableStates,
  sortBy,
  setSortBy,
  onClearFilters,
  isFilterActive,
  onViewDetails
}) => {
  const map = useMap();
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Disable Leaflet map clicks and scroll events within the panel
  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, [isExpanded, isMobileOpen]);

  const handleLocationClick = (loc) => {
    onSelectLocation(loc);
    // Smoothly fly map to selected location
    if (map && loc.lat && loc.lng) {
      map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 11), {
        animate: true,
        duration: 1.2
      });
    }
    // On mobile, close sheet after selection to view marker
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const isLocationSelected = (loc) => {
    if (!selectedLocation || !loc) return false;
    if (loc.id && selectedLocation.id && loc.id === selectedLocation.id) return true;
    return (
      Math.abs(Number(loc.lat) - Number(selectedLocation.lat)) < 0.0001 &&
      Math.abs(Number(loc.lng) - Number(selectedLocation.lng)) < 0.0001
    );
  };

  const totalCount = locations.length;
  const matchCount = filteredLocations.length;

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="md:hidden absolute bottom-20 left-4 z-[1000]">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="bg-white/95 backdrop-blur-sm border border-stone-300 text-stone-800 px-3.5 py-2 rounded-xl shadow-md font-sans text-xs font-semibold flex items-center gap-2 hover:bg-stone-50 active:scale-95 transition-all"
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

      {/* Main Filter & Locations Panel */}
      <div
        ref={containerRef}
        className={`z-[1000] font-sans transition-all duration-200 ${
          // Mobile drawer vs Desktop floating sidebar
          isMobileOpen
            ? 'fixed inset-x-0 bottom-0 max-h-[80vh] md:max-h-none md:fixed-none md:inset-auto bg-white rounded-t-2xl md:rounded-xl shadow-2xl p-4 flex flex-col md:hidden'
            : 'hidden md:flex flex-col absolute top-[76px] left-4 w-[320px] lg:w-[340px] max-h-[calc(100vh-160px)]'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm border border-stone-200 rounded-xl shadow-md overflow-hidden flex flex-col max-h-full">
          {/* Header */}
          <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <h2 className="font-serif font-bold text-stone-800 text-sm tracking-tight">
                Travel Locations
              </h2>
              <span className="bg-stone-200/80 text-stone-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Desktop Collapse / Expand Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:inline-flex text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition-colors"
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
                className="md:hidden text-stone-500 hover:text-stone-800 p-1 rounded-md hover:bg-stone-100 transition-colors"
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
            <div className="p-3.5 flex flex-col gap-3 overflow-hidden">
              {/* Search by location name */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Filter by location name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-stone-400 hover:text-stone-700 text-xs p-0.5 rounded"
                    title="Clear search text"
                    aria-label="Clear search text"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filters & Sorting row */}
              <div className="grid grid-cols-2 gap-2">
                {/* State Filter */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="state-filter-select" className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                    State
                  </label>
                  <select
                    id="state-filter-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 outline-none focus:border-stone-400 focus:bg-white cursor-pointer transition-all"
                  >
                    <option value="All">All States</option>
                    {availableStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort dropdown */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="sort-locations-select" className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                    Sort By
                  </label>
                  <select
                    id="sort-locations-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 outline-none focus:border-stone-400 focus:bg-white cursor-pointer transition-all"
                  >
                    <option value="name-asc">Name (A → Z)</option>
                    <option value="name-desc">Name (Z → A)</option>
                    <option value="date-desc">Date (Newest)</option>
                    <option value="date-asc">Date (Oldest)</option>
                  </select>
                </div>
              </div>

              {/* Status & Reset bar */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                <span className="text-stone-600 font-medium">
                  Showing <span className="font-bold text-stone-800">{matchCount}</span> of {totalCount} {totalCount === 1 ? 'location' : 'locations'}
                </span>

                {isFilterActive && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-orange-700 hover:text-orange-900 font-semibold text-[11px] hover:underline flex items-center gap-1 transition-colors"
                  >
                    <span>↺</span> Clear Filters
                  </button>
                )}
              </div>

              {/* Locations List */}
              <div className="overflow-y-auto max-h-[220px] md:max-h-[260px] flex flex-col gap-1.5 pr-0.5">
                {matchCount > 0 ? (
                  filteredLocations.map((loc) => {
                    const isSelected = isLocationSelected(loc);
                    return (
                      <div
                        key={loc.id || `${loc.lat}-${loc.lng}-${loc.name}`}
                        onClick={() => handleLocationClick(loc)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLocationClick(loc);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                        className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer group flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-orange-50/70 border-orange-300 ring-1 ring-orange-300 shadow-xs'
                            : 'bg-white hover:bg-stone-50/80 border-stone-200 hover:border-stone-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-serif font-bold text-xs leading-snug tracking-tight ${isSelected ? 'text-orange-900' : 'text-stone-800 group-hover:text-stone-900'}`}>
                            {loc.name}
                          </span>
                          {loc.stateName && (
                            <span className="shrink-0 bg-stone-100 text-stone-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
                              {loc.stateName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 mt-0.5">
                          <span>
                            {loc.lastVisited ? (
                              <span>Visited: <span className="font-medium text-stone-700">{loc.lastVisited}</span></span>
                            ) : (
                              <span className="italic text-stone-400">Date not recorded</span>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails(loc);
                            }}
                            className="text-orange-700 hover:text-orange-800 font-medium text-[11px] opacity-80 group-hover:opacity-100 hover:underline flex items-center gap-0.5"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Empty state */
                  <div className="py-6 px-3 flex flex-col items-center justify-center text-center bg-stone-50/60 rounded-lg border border-dashed border-stone-200">
                    <span className="text-2xl mb-1.5">🔍</span>
                    <p className="font-serif font-bold text-xs text-stone-700 mb-1">
                      No matching locations
                    </p>
                    <p className="text-[11px] text-stone-500 mb-3 max-w-[200px]">
                      No places match your search or filter settings.
                    </p>
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="bg-orange-700 hover:bg-orange-800 text-white text-xs px-3 py-1 rounded-md font-medium transition-colors shadow-xs"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LocationFilterPanel;
