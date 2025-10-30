'use client';

import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Trash2, MapPin } from 'lucide-react';

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  sequence?: number;
}

interface RoutePlannerMapProps {
  waypoints: Waypoint[];
  onWaypointsChange: (waypoints: Waypoint[]) => void;
  height?: string;
}

// Task marker icon
const createTaskIcon = (sequence?: number) => {
  return L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        font-weight: bold;
        color: white;
      ">
        ${sequence || '?'}
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Start marker icon
const startIcon = L.divIcon({
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background-color: #10b981;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function RoutePlannerMap({
  waypoints,
  onWaypointsChange,
  height = '600px',
}: RoutePlannerMapProps) {
  const [isAddingMode, setIsAddingMode] = useState(false);
  
  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (!isAddingMode) return;
    
    const newWaypoint: Waypoint = {
      id: `waypoint-${Date.now()}`,
      lat,
      lng,
      sequence: waypoints.length + 1,
    };
    
    onWaypointsChange([...waypoints, newWaypoint]);
    setIsAddingMode(false);
  }, [isAddingMode, waypoints, onWaypointsChange]);
  
  const removeWaypoint = (id: string) => {
    const updated = waypoints
      .filter(w => w.id !== id)
      .map((w, index) => ({ ...w, sequence: index + 1 }));
    onWaypointsChange(updated);
  };
  
  const center: [number, number] = waypoints.length > 0
    ? [waypoints[0].lat, waypoints[0].lng]
    : [-26.1950, 28.0340];
  
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-[1000] space-x-2">
        <Button
          variant={isAddingMode ? 'destructive' : 'default'}
          size="sm"
          onClick={() => setIsAddingMode(!isAddingMode)}
        >
          <MapPin className="w-4 h-4 mr-2" />
          {isAddingMode ? 'Cancel' : 'Add Waypoint'}
        </Button>
        {waypoints.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWaypointsChange([])}
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%', cursor: isAddingMode ? 'crosshair' : 'grab' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Waypoint markers */}
          {waypoints.map((waypoint, index) => (
            <Marker
              key={waypoint.id}
              position={[waypoint.lat, waypoint.lng]}
              icon={index === 0 ? startIcon : createTaskIcon(waypoint.sequence)}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  const updated = waypoints.map(w =>
                    w.id === waypoint.id
                      ? { ...w, lat: position.lat, lng: position.lng }
                      : w
                  );
                  onWaypointsChange(updated);
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      {index === 0 ? 'Start Point' : `Stop ${waypoint.sequence}`}
                    </h4>
                    {index !== 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWaypoint(waypoint.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {waypoint.lat.toFixed(6)}, {waypoint.lng.toFixed(6)}
                  </p>
                  {waypoint.address && (
                    <p className="text-xs mt-1">{waypoint.address}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Instructions */}
      {isAddingMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Click on the map to add a waypoint
          </div>
        </div>
      )}
    </div>
  );
}