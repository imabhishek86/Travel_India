import React, { useState, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const SearchLocation = ({ setSelectedLocation, setShowLocationCard }) => {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsSearching(true);
    setErrorMsg('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=in&addressdetails=1&q=${encodeURIComponent(trimmedQuery)}`, 
        { headers: { 'User-Agent': 'TravelMapIndia/1.0' } }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        
        // India constraint: Nominatim countrycodes=in generally works, but double check.
        if (result.address && result.address.country_code && result.address.country_code !== 'in') {
           setErrorMsg("Location not found in India. Try another city or place.");
           return;
        }

        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        const address = result.address || {};
        const city = address.city || address.town || address.village || address.county || address.state_district || result.name || "Unknown Location";
        const state = address.state || "";
        
        let locationName = city;
        if (state && city !== state) {
          locationName = `${city}, ${state}`;
        } else if (state && city === state) {
           locationName = state;
        }

        // Fly to location
        map.flyTo([lat, lon], 13, {
          animate: true,
          duration: 1.5
        });

        // Set date
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

        setSelectedLocation({
          lat: lat,
          lng: lon,
          name: locationName,
          stateName: state,
          lastVisited: formattedDate
        });
        
        setShowLocationCard(true);
      } else {
        setErrorMsg("Location not found. Try another city or place.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setErrorMsg("Unable to search right now. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute top-[88px] md:top-4 left-1/2 md:left-4 -translate-x-1/2 md:translate-x-0 z-[1000] w-[92%] md:w-[300px]"
    >
      <form onSubmit={handleSearch} className="flex flex-col gap-2">
        <div className="flex bg-white/95 backdrop-blur-sm border border-stone-200 rounded-xl shadow-sm overflow-hidden transition-all focus-within:border-stone-400 focus-within:shadow-md">
          <input
            type="text"
            placeholder="Search a city or place..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            className="flex-1 px-4 py-2.5 bg-transparent text-stone-800 text-sm outline-none placeholder:text-stone-400 font-sans"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="px-4 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {isSearching && (
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-stone-200 shadow-sm text-sm text-stone-600 font-medium">
            Searching...
          </div>
        )}

        {errorMsg && !isSearching && (
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-red-200 shadow-sm text-sm text-red-600 font-medium">
            {errorMsg}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchLocation;
