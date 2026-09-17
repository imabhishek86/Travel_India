import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const DEMO_LOCATIONS = [
  { id: 1, name: 'Delhi', position: [28.6139, 77.2090] },
  { id: 2, name: 'Mumbai', position: [19.0760, 72.8777] },
  { id: 3, name: 'Goa', position: [15.2993, 74.1240] },
  { id: 4, name: 'Jaipur', position: [26.9124, 75.7873] },
  { id: 5, name: 'Bengaluru', position: [12.9716, 77.5946] },
];

const Map = () => {
  // Center of India approximately
  const centerPosition = [22.9734, 78.6569];

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={5} 
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg shadow-inner z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {DEMO_LOCATIONS.map((location) => (
          <Marker key={location.id} position={location.position}>
            <Popup className="rounded-lg shadow-md">
              <div className="text-center p-1">
                <h3 className="font-bold text-lg text-slate-800 mb-2">{location.name}</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors w-full">
                  View Memories
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
