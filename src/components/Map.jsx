import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import SearchLocation from './SearchLocation';
import LocationFilterPanel from './LocationFilterPanel';

// Fix for default Leaflet marker icon issue in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to determine whether two location records match
const isSameLocation = (locA, locB) => {
  if (!locA || !locB) return false;
  if (locA.id && locB.id && locA.id === locB.id) return true;
  return (
    Math.abs(Number(locA.lat) - Number(locB.lat)) < 0.0001 &&
    Math.abs(Number(locA.lng) - Number(locB.lng)) < 0.0001
  );
};

import { DEFAULT_DEMO_LOCATIONS, parseVisitDate } from '../data/locations';

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      try {
        if (e && e.latlng) {
          onMapClick({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          });
        }
      } catch (error) {
        console.error("Failed to handle map click:", error);
      }
    }
  });
  return null;
};

// Component to handle focusing on an incoming target location from navigation state
const MapFocusHandler = ({ targetLocation }) => {
  const map = useMap();
  const focusedRef = useRef(null);

  useEffect(() => {
    if (targetLocation && targetLocation.lat && targetLocation.lng) {
      const targetKey = targetLocation.id || `${targetLocation.lat},${targetLocation.lng}`;
      if (focusedRef.current !== targetKey) {
        focusedRef.current = targetKey;
        const timer = setTimeout(() => {
          map.flyTo([targetLocation.lat, targetLocation.lng], 12, {
            animate: true,
            duration: 1.2
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [map, targetLocation]);

  return null;
};

// Center of India approximately
const centerPosition = [22.9734, 78.6569];

// Bounding box for India region
const indiaBounds = [
  [6.0, 68.0],
  [37.5, 97.5]
];

const FitIndiaBounds = () => {
    const map = useMap();

    useEffect(() => {
        // Run after initial layout to ensure container dimensions are calculated
        setTimeout(() => {
            map.invalidateSize();
            
            // Automatically fit the map to the India bounds with padding
            map.fitBounds(indiaBounds, {
                padding: [20, 20],
                animate: false
            });

            // Lock the minimum zoom to whatever zoom was calculated to fit India
            // This prevents zooming out further than the whole country view
            map.setMinZoom(map.getZoom());
        }, 100);
    }, [map]);

    return null;
};

const Map = () => {
  const routerLocation = useLocation();
  const navSelected = routerLocation?.state?.selectedLocation;

  // Underlying locations dataset: single source of truth initialized from localStorage or defaults
  const [locations, setLocations] = useState(() => {
    let base = DEFAULT_DEMO_LOCATIONS;
    try {
      const savedLocations = localStorage.getItem('travelMapLocations');
      if (savedLocations) {
        const parsed = JSON.parse(savedLocations);
        if (Array.isArray(parsed) && parsed.length > 0) {
          base = parsed;
        }
      }
    } catch (error) {
      console.error("Error reading travelMapLocations from localStorage:", error);
    }

    if (navSelected && navSelected.lat && navSelected.lng) {
      const exists = base.some((d) => isSameLocation(d, navSelected));
      if (!exists) {
        return [navSelected, ...base];
      }
      return base;
    }

    // Merge with any existing single selectedLocation from localStorage if available
    try {
      const savedSelected = localStorage.getItem('travelMapSelectedLocation');
      if (savedSelected) {
        const parsed = JSON.parse(savedSelected);
        if (parsed && parsed.lat && parsed.lng) {
          const exists = base.some((d) => isSameLocation(d, parsed));
          if (!exists) {
            return [parsed, ...base];
          }
        }
      }
    } catch (error) {
      console.error("Error reading travelMapSelectedLocation:", error);
    }

    return base;
  });

  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (navSelected && navSelected.lat && navSelected.lng) {
      return navSelected;
    }
    try {
      const savedLocation = localStorage.getItem('travelMapSelectedLocation');
      if (savedLocation) {
        return JSON.parse(savedLocation);
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
    return null;
  });

  const [showLocationCard, setShowLocationCard] = useState(() => {
    return Boolean(navSelected && navSelected.lat && navSelected.lng);
  });

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  const hideTimerRef = useRef(null);
  const navigate = useNavigate();

  // Persist locations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('travelMapLocations', JSON.stringify(locations));
    } catch (error) {
      console.error("Error writing travelMapLocations to localStorage:", error);
    }
  }, [locations]);

  // Persist selected location to localStorage
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('travelMapSelectedLocation', JSON.stringify(selectedLocation));
    } else {
      localStorage.removeItem('travelMapSelectedLocation');
    }
  }, [selectedLocation]);

  // Compute available unique states from locations where stateName exists
  const availableStates = useMemo(() => {
    const states = new Set(locations.map((loc) => loc.stateName).filter(Boolean));
    return Array.from(states).sort();
  }, [locations]);

  // Derive filtered and sorted locations without mutating original array
  const filteredLocations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter
    const filtered = locations.filter((loc) => {
      // Search by location name (case-insensitive)
      const matchesName = !query || (loc.name && loc.name.toLowerCase().includes(query));
      // Search / filter by state if selected
      const matchesState = selectedState === 'All' || loc.stateName === selectedState;
      return matchesName && matchesState;
    });

    // 2. Sort without mutating original objects
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
      }
      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '', undefined, { sensitivity: 'base' });
      }
      if (sortBy === 'date-desc') {
        const timeA = parseVisitDate(a.lastVisited);
        const timeB = parseVisitDate(b.lastVisited);
        if (timeA !== null && timeB !== null) {
          if (timeB !== timeA) return timeB - timeA;
          return (a.name || '').localeCompare(b.name || '');
        }
        if (timeA !== null) return -1;
        if (timeB !== null) return 1;
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'date-asc') {
        const timeA = parseVisitDate(a.lastVisited);
        const timeB = parseVisitDate(b.lastVisited);
        if (timeA !== null && timeB !== null) {
          if (timeA !== timeB) return timeA - timeB;
          return (a.name || '').localeCompare(b.name || '');
        }
        if (timeA !== null) return -1;
        if (timeB !== null) return 1;
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [locations, searchQuery, selectedState, sortBy]);

  // Check if any filter or non-default sort is active
  const isFilterActive = searchQuery.trim() !== '' || selectedState !== 'All' || sortBy !== 'name-asc';

  // Reset filters to defaults
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSortBy('name-asc');
  };

  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowLocationCard(true);
  };

  const handleMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setShowLocationCard(false);
    }, 250);
  };

  // Add or update location in the dataset safely
  const saveLocationToDataset = (newLoc) => {
    setLocations((prev) => {
      const exists = prev.some((l) => isSameLocation(l, newLoc));
      if (exists) return prev;
      return [newLoc, ...prev];
    });
  };

  const handleMapClick = async (coords) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const pendingLoc = {
      id: `loc-${Date.now()}`,
      lat: coords.lat,
      lng: coords.lng,
      name: "Locating...",
      stateName: "",
      lastVisited: formattedDate
    };

    setSelectedLocation(pendingLoc);
    setShowLocationCard(true);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`, {
        headers: {
          'User-Agent': 'TravelMapIndia/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.county || address.state_district || "Unknown Location";
      const state = address.state || "";
      
      let locationName = city;
      if (state && city !== state) {
        locationName = `${city}, ${state}`;
      } else if (state && city === state) {
         locationName = state;
      }

      const completedLoc = {
        id: `loc-${Date.now()}`,
        lat: coords.lat,
        lng: coords.lng,
        name: locationName,
        stateName: state,
        lastVisited: formattedDate
      };

      setSelectedLocation(completedLoc);
      saveLocationToDataset(completedLoc);

    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      
      const fallbackLoc = {
        id: `loc-${Date.now()}`,
        lat: coords.lat,
        lng: coords.lng,
        name: "Selected Location",
        stateName: "",
        lastVisited: formattedDate
      };

      setSelectedLocation(fallbackLoc);
      saveLocationToDataset(fallbackLoc);
    }
  };

  const handleLocationFound = (newLoc) => {
    setSelectedLocation(newLoc);
    saveLocationToDataset(newLoc);
    setShowLocationCard(true);
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setShowLocationCard(true);
  };

  const handleViewDetails = (locToView) => {
    const target = locToView || selectedLocation;
    if (target) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_location",
        location_name: target.name
      });
      navigate('/location/details', { state: target });
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // Dashboard statistics based on total dataset to preserve intended meaning
  const totalPlacesVisited = locations.length;
  const uniqueStatesCount = useMemo(() => {
    return new Set(locations.map((loc) => loc.stateName).filter(Boolean)).size;
  }, [locations]);

  return (
    <div className="absolute inset-0 z-0 flex justify-center bg-[#faf9f6]">
      <MapContainer 
        center={centerPosition} 
        zoom={5}
        maxZoom={18}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <FitIndiaBounds />
        <MapFocusHandler targetLocation={navSelected} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <SearchLocation 
          setSelectedLocation={setSelectedLocation} 
          setShowLocationCard={setShowLocationCard}
          onLocationFound={handleLocationFound}
        />

        <LocationFilterPanel 
          locations={locations}
          filteredLocations={filteredLocations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          availableStates={availableStates}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClearFilters={handleClearFilters}
          isFilterActive={isFilterActive}
          onViewDetails={handleViewDetails}
        />
        
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Only the currently selected location is visually represented by a marker */}
        {selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]}
            eventHandlers={{
              mouseover: handleMouseEnter,
              mouseout: handleMouseLeave,
              click: handleMouseEnter, // Handle mobile taps
              dblclick: (e) => {
                // Prevent map zoom on double-click
                if (e.originalEvent) {
                  L.DomEvent.stopPropagation(e.originalEvent);
                }
                setSelectedLocation(null);
                setShowLocationCard(false);
              }
            }}
          >
            {/* Tooltip acts as a hover card on desktop, tap card on mobile.
                interactive={true} ensures we can click inside it. 
                permanent={true} allows us to control its visibility entirely with React state. */}
            {showLocationCard && (
              <Tooltip 
                direction="top" 
                offset={[0, -40]} 
                opacity={1} 
                interactive={true}
                permanent={true}
              >
                <div 
                  className="flex flex-col gap-1 p-2 font-sans cursor-pointer group min-w-[140px]"
                  onClick={() => handleViewDetails(selectedLocation)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="font-bold font-serif text-stone-800 text-[16px] leading-tight tracking-tight">
                    {selectedLocation.name}
                  </span>
                  {selectedLocation.lastVisited ? (
                    <span className="text-stone-500 text-[11px] font-medium border-b border-stone-100 pb-2 mb-1 uppercase tracking-wide">
                      Visited: <span className="text-stone-800">{selectedLocation.lastVisited}</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 text-[11px] italic border-b border-stone-100 pb-2 mb-1">
                      Visit date not recorded
                    </span>
                  )}
                  <span className="text-orange-700 text-[13px] font-medium group-hover:text-orange-800 transition-colors flex items-center justify-between">
                    View Journal <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Tooltip>
            )}
          </Marker>
        )}
      </MapContainer>

      {/* Travel Statistics - Preserves total counts as intended */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm py-2.5 px-4 md:py-3 md:px-8 rounded-xl shadow-sm border border-stone-200 flex flex-row flex-wrap justify-center md:flex-nowrap items-center gap-x-6 gap-y-3 pointer-events-none transition-all w-[92%] md:w-auto max-w-3xl">
        
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">📍</span>
          <div className="flex flex-col">
            <span className="font-bold text-stone-800 text-sm md:text-base leading-none">
              {totalPlacesVisited}
            </span>
            <span className="text-stone-500 text-[10px] md:text-[11px] font-medium uppercase tracking-wider mt-0.5 whitespace-nowrap">
              Places Visited
            </span>
          </div>
        </div>

        <div className="hidden md:block w-px h-6 bg-stone-200"></div>

        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">🇮🇳</span>
          <div className="flex flex-col">
            <span className="font-bold text-stone-800 text-sm md:text-base leading-none">
              {uniqueStatesCount}
            </span>
            <span className="text-stone-500 text-[10px] md:text-[11px] font-medium uppercase tracking-wider mt-0.5 whitespace-nowrap">
              States Covered
            </span>
          </div>
        </div>

        <div className="hidden md:block w-px h-6 bg-stone-200"></div>

        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">📸</span>
          <div className="flex flex-col">
            <span className="font-bold text-stone-800 text-sm md:text-base leading-none">
              0
            </span>
            <span className="text-stone-500 text-[10px] md:text-[11px] font-medium uppercase tracking-wider mt-0.5 whitespace-nowrap">
              Memories Added
            </span>
          </div>
        </div>

      </div>

      {/* Visited Places Counter - Reflects total places visited */}
      <div className="absolute bottom-6 right-4 md:top-6 md:bottom-auto md:right-6 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-stone-200 flex items-center gap-2 pointer-events-none transition-all">
        <span className="text-base leading-none">📍</span>
        <span className="font-medium font-sans text-stone-800 text-[13px] tracking-wide">
          {totalPlacesVisited} {totalPlacesVisited === 1 ? 'Place' : 'Places'} Visited
        </span>
      </div>
    </div>
  );
};

export default Map;
