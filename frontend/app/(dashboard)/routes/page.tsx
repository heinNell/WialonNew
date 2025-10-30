'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MapPin, Calendar, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function RoutesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: routes, isLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: () => api.getRoutes(),
  });

  const optimizeMutation = useMutation({
    mutationFn: (id: string) => api.optimizeRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route optimized successfully');
    },
    onError: () => {
      toast.error('Failed to optimize route');
    },
  });

  const filteredRoutes = routes?.filter((route: any) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalDistance = routes?.reduce(
    (sum: number, route: any) => sum + (route.totalDistance || 0),
    0
  ) || 0;

  const activeRoutes = routes?.filter((r: any) => r.status === 'active').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Routes</h1>
          <p className="text-gray-600 mt-1">
            Plan and optimize delivery routes
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/routes/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Route
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {routes?.length || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Routes</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {activeRoutes}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distance</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {totalDistance.toFixed(0)} km
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  4.2h
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Loading routes...
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No routes found
          </div>
        ) : (
          filteredRoutes.map((route: any) => (
            <Card
              key={route.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/routes/${route.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    {route.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {route.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      route.status
                    )} text-white`}
                  >
                    {route.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Vehicle */}
                  {route.vehicleId && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Vehicle: {route.vehicleId}
                      </span>
                    </div>
                  )}

                  {/* Schedule */}
                  {route.scheduledStartTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {formatDate(route.scheduledStartTime, 'PPp')}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Distance</p>
                      <p className="font-semibold">{route.totalDistance?.toFixed(0) || 0} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-semibold">
                        {Math.floor((route.estimatedDuration || 0) / 60)}h {(route.estimatedDuration || 0) % 60}m
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Tasks</p>
                      <p className="font-semibold">
                        {route.completedTasks || 0}/{route.totalTasks || 0}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    {!route.isOptimized && route.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          optimizeMutation.mutate(route.id);
                        }}
                      >
                        Optimize
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/routes/${route.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}