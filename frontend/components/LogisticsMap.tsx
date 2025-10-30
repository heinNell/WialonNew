'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LogisticsMapProps {
  checkpoints: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
    status: 'pending' | 'completed';
    order: number;
  }>;
  vehicle?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export default function LogisticsMap({ checkpoints, vehicle }: LogisticsMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('logistics-map').setView([0, 0], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add checkpoint markers
    checkpoints.forEach((checkpoint, index) => {
      const marker = L.marker([checkpoint.lat, checkpoint.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="marker-pin ${checkpoint.status}">
              <span class="marker-number">${index + 1}</span>
            </div>
          `,
          iconSize: [30, 42],
          iconAnchor: [15, 42]
        })
      })
      .bindPopup(`
        <div class="marker-popup">
          <h3>${checkpoint.name}</h3>
          <p>Status: ${checkpoint.status}</p>
        </div>
      `)
      .addTo(map);

      markersRef.current.push(marker);
    });

    // Add vehicle marker if exists
    if (vehicle) {
      const vehicleMarker = L.marker([vehicle.lat, vehicle.lng], {
        icon: L.divIcon({
          className: 'vehicle-marker',
          html: `
            <div class="vehicle-pin">
              🚚
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      })
      .bindPopup(`
        <div class="marker-popup">
          <h3>${vehicle.name}</h3>
          <p>Current Position</p>
        </div>
      `)
      .addTo(map);

      markersRef.current.push(vehicleMarker);
    }

    // Draw route line
    if (checkpoints.length > 1) {
      const coordinates: [number, number][] = checkpoints.map(cp => [cp.lat, cp.lng]);
      
      L.polyline(coordinates, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(map);
    }

    // Fit map to show all markers
    if (checkpoints.length > 0) {
      const bounds = L.latLngBounds(checkpoints.map(cp => [cp.lat, cp.lng]));
      if (vehicle) {
        bounds.extend([vehicle.lat, vehicle.lng]);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [checkpoints, vehicle]);

  return (
    <>
      <div id="logistics-map" style={{ width: '100%', height: '600px', borderRadius: '0.5rem' }} />
      
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }

        .marker-pin {
          width: 30px;
          height: 42px;
          border-radius: 50% 50% 50% 0;
          background: #3b82f6;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -42px 0 0 -15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-pin.completed {
          background: #10b981;
        }

        .marker-number {
          color: white;
          font-weight: bold;
          font-size: 14px;
          transform: rotate(45deg);
        }

        .marker-pin::after {
          content: '';
          width: 10px;
          height: 10px;
          margin: 16px 0 0 10px;
          background: white;
          position: absolute;
          border-radius: 50%;
        }

        .vehicle-marker {
          background: transparent;
          border: none;
        }

        .vehicle-pin {
          width: 40px;
          height: 40px;
          background: white;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .marker-popup h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .marker-popup p {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </>
  );
}