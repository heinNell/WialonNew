'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import ws from '@/lib/websocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VehicleMap from '@/components/map/vehicle-map';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getStatusColor, formatRelativeTime } from '@/lib/utils';

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: vehicles, isLoading, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.getVehicles(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  const handleSync = async () => {
    try {
      await api.syncVehicles();
      toast.success('Vehicles synced successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to sync vehicles');
    }
  };
  
  const filteredVehicles = vehicles?.filter((vehicle: any) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];
  
  const onlineCount = vehicles?.filter((v: any) => v.isOnline).length || 0;
  const activeCount = vehicles?.filter((v: any) => v.status === 'active').length || 0;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600 mt-1">
            {onlineCount} online • {activeCount} active
          </p>
        </div>
        <Button onClick={handleSync}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync with Wialon
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      {/* Map and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Vehicle List ({filteredVehicles.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {filteredVehicles.map((vehicle: any) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedVehicleId === vehicle.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{vehicle.name}</h4>
                    <span className={`w-2 h-2 rounded-full ${vehicle.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(vehicle.status)} text-white`}>
                      {vehicle.status}
                    </span>
                    {vehicle.currentSpeed !== undefined && (
                      <span className="text-xs text-gray-600">
                        {vehicle.currentSpeed.toFixed(0)} km/h
                      </span>
                    )}
                  </div>
                  {vehicle.lastMessageTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last update: {formatRelativeTime(vehicle.lastMessageTime)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleMap
              vehicles={filteredVehicles}
              selectedVehicleId={selectedVehicleId}
              onVehicleClick={(vehicle: any) => setSelectedVehicleId(vehicle.id)}
              height="600px"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}