import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

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
        
        <MapClickHandler onMapClick={setSelectedLocation} />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup className="rounded-lg shadow-md min-w-[200px]">
              <div className="text-center p-2">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-2">Selected Location</h3>
                
                <div className="text-sm text-slate-600 mb-4 space-y-1">
                  <p><span className="font-semibold text-slate-700">Latitude:</span> {selectedLocation.lat.toFixed(6)}</p>
                  <p><span className="font-semibold text-slate-700">Longitude:</span> {selectedLocation.lng.toFixed(6)}</p>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full shadow-sm hover:shadow">
                  Add Memory
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
