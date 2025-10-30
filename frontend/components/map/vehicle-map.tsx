'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { toast } from 'sonner';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/markers/marker-icon-2x.png',
  iconUrl: '/markers/marker-icon.png',
  shadowUrl: '/markers/marker-shadow.png',
});

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  currentLat?: number;
  currentLng?: number;
  currentSpeed?: number;
  isOnline: boolean;
  status: string;
}

interface VehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onVehicleClick?: (vehicle: Vehicle) => void;
  showRoute?: boolean;
  routePoints?: Array<{ lat: number; lng: number }>;
  height?: string;
}

// Custom vehicle icon
const createVehicleIcon = (isOnline: boolean, isSelected: boolean) => {
  const color = isOnline ? '#10b981' : '#6b7280';
  const size = isSelected ? 40 : 30;
  
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Map updater component
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

// Route renderer component
function RouteRenderer({ points }: { points: Array<{ lat: number; lng: number }> }) {
  const map = useMap();
  
  useEffect(() => {
    if (points.length < 2) return;
    
    const waypoints = points.map(p => L.latLng(p.lat, p.lng));
    
    // Type assertion for Leaflet Routing plugin
    const routingControl = (L as any).Routing.control({
      waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 4, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      createMarker: () => null, // Don't show default markers
    }).addTo(map);
    
    return () => {
      map.removeControl(routingControl);
    };
  }, [points, map]);
  
  return null;
}

export default function VehicleMap({
  vehicles,
  selectedVehicleId,
  onVehicleClick,
  showRoute = false,
  routePoints = [],
  height = '600px',
}: VehicleMapProps) {
  const [center, setCenter] = useState<[number, number]>([-26.1950, 28.0340]); // Johannesburg
  const [zoom, setZoom] = useState(12);
  
  useEffect(() => {
    // Center on selected vehicle
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle?.currentLat && vehicle?.currentLng) {
        setCenter([vehicle.currentLat, vehicle.currentLng]);
        setZoom(15);
      }
    } else if (vehicles.length > 0) {
      // Center on all vehicles
      const bounds = vehicles
        .filter(v => v.currentLat && v.currentLng)
        .map(v => [v.currentLat!, v.currentLng!] as [number, number]);
      
      if (bounds.length > 0) {
        const avgLat = bounds.reduce((sum, b) => sum + b[0], 0) / bounds.length;
        const avgLng = bounds.reduce((sum, b) => sum + b[1], 0) / bounds.length;
        setCenter([avgLat, avgLng]);
      }
    }
  }, [selectedVehicleId, vehicles]);
  
  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} zoom={zoom} />
        
        {/* Vehicle markers */}
        {vehicles
          .filter(v => v.currentLat && v.currentLng)
          .map(vehicle => (
            <Marker
              key={vehicle.id}
              position={[vehicle.currentLat!, vehicle.currentLng!]}
              icon={createVehicleIcon(vehicle.isOnline, vehicle.id === selectedVehicleId)}
              eventHandlers={{
                click: () => onVehicleClick?.(vehicle),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{vehicle.name}</h3>
                  <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${vehicle.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-xs">{vehicle.isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    {vehicle.currentSpeed !== undefined && (
                      <p className="text-xs">Speed: {vehicle.currentSpeed.toFixed(1)} km/h</p>
                    )}
                    <p className="text-xs">Status: {vehicle.status}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        
        {/* Route visualization */}
        {showRoute && routePoints.length > 0 && (
          <RouteRenderer points={routePoints} />
        )}
      </MapContainer>
    </div>
  );
}