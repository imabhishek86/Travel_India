import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

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

// Center of India approximately
const centerPosition = [22.9734, 78.6569];

// Bounding box for India region
const indiaBounds = [
  [6.0, 68.0],
  [37.5, 97.5]
];

const FitIndiaBounds = () => {
    const map = useMap();

    React.useEffect(() => {
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
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      // NOTE: We cannot reliably distinguish between a normal reload (F5) 
      // and a hard reload (Ctrl+F5) using the Performance Navigation API.
      // Both return type === 'reload'. Therefore, to ensure the marker 
      // survives a normal reload as requested, we always restore it.
      // The user can remove the marker by double-clicking it.
      const savedLocation = localStorage.getItem('travelMapSelectedLocation');
      if (savedLocation) {
        return JSON.parse(savedLocation);
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
    return null;
  });
  const [showLocationCard, setShowLocationCard] = useState(false);

  React.useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('travelMapSelectedLocation', JSON.stringify(selectedLocation));
    } else {
      localStorage.removeItem('travelMapSelectedLocation');
    }
  }, [selectedLocation]);
  const hideTimerRef = React.useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowLocationCard(true);
  };

  const handleMouseLeave = () => {
    // Small delay before hiding so user can move mouse to the tooltip
    hideTimerRef.current = setTimeout(() => {
      setShowLocationCard(false);
    }, 250);
  };

  const handleMapClick = async (coords) => {
    // TEMPORARY: This will later come from MongoDB when memories are stored
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Set initial loading state and automatically show the card on new click
    setSelectedLocation({
      lat: coords.lat,
      lng: coords.lng,
      name: "Locating...",
      lastVisited: formattedDate
    });
    setShowLocationCard(true);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`, {
        headers: {
          'User-Agent': 'TravelMapIndia/1.0' // Respect API usage requirements
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

      setSelectedLocation({
        lat: coords.lat,
        lng: coords.lng,
        name: locationName,
        lastVisited: formattedDate
      });

    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      
      // Fallback on error so application doesn't crash
      setSelectedLocation({
        lat: coords.lat,
        lng: coords.lng,
        name: "Selected Location",
        lastVisited: formattedDate
      });
    }
  };

  const handleViewDetails = () => {
    if (selectedLocation) {
      // Pass the selected location via React Router state
      navigate('/location/details', { state: selectedLocation });
    }
  };

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={handleMapClick} />

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
                  onClick={handleViewDetails}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="font-bold font-serif text-stone-800 text-[16px] leading-tight tracking-tight">
                    {selectedLocation.name}
                  </span>
                  <span className="text-stone-500 text-[11px] font-medium border-b border-stone-100 pb-2 mb-1 uppercase tracking-wide">
                    Visited: <span className="text-stone-800">{selectedLocation.lastVisited}</span>
                  </span>
                  <span className="text-orange-700 text-[13px] font-medium group-hover:text-orange-800 transition-colors flex items-center justify-between">
                    View Journal <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Tooltip>
            )}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
