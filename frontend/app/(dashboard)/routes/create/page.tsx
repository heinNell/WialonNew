'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RoutePlannerMap from '@/components/map/route-planner-map';
import { toast } from 'sonner';
import { ArrowLeft, Save, Zap } from 'lucide-react';

const routeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  vehicleId: z.string().optional(),
  scheduledStartTime: z.string().optional(),
  scheduledEndTime: z.string().optional(),
});

type RouteFormData = z.infer<typeof routeSchema>;

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  taskId?: string;
  sequence?: number;
}

export default function CreateRoutePage() {
  const router = useRouter();
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.getVehicles(),
  });

  const { data: tasks } = useQuery({
    queryKey: ['available-tasks'],
    queryFn: () => api.getTasks({ status: 'pending' }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createRoute(data),
    onSuccess: (data) => {
      toast.success('Route created successfully');
      router.push(`/dashboard/routes/${data.id}`);
    },
    onError: () => {
      toast.error('Failed to create route');
    },
  });

  const onSubmit = (data: RouteFormData) => {
    if (waypoints.length < 2) {
      toast.error('Please add at least 2 waypoints');
      return;
    }

    const routeData = {
      ...data,
      startLatitude: waypoints[0].lat,
      startLongitude: waypoints[0].lng,
      startAddress: waypoints[0].address,
      endLatitude: waypoints[waypoints.length - 1].lat,
      endLongitude: waypoints[waypoints.length - 1].lng,
      endAddress: waypoints[waypoints.length - 1].address,
      taskIds: selectedTaskIds,
      waypoints: waypoints.map((wp, index) => ({
        latitude: wp.lat,
        longitude: wp.lng,
        address: wp.address,
        sequence: index + 1,
        taskId: wp.taskId,
      })),
    };

    createMutation.mutate(routeData);
  };

  const handleAddTask = (taskId: string) => {
    const task = tasks?.find((t: any) => t.id === taskId);
    if (!task) return;

    const newWaypoint: Waypoint = {
      id: `waypoint-${Date.now()}`,
      lat: task.latitude,
      lng: task.longitude,
      address: task.address,
      taskId: task.id,
      sequence: waypoints.length + 1,
    };

    setWaypoints([...waypoints, newWaypoint]);
    setSelectedTaskIds([...selectedTaskIds, taskId]);
  };

  const handleRemoveTask = (taskId: string) => {
    setWaypoints(waypoints.filter((wp) => wp.taskId !== taskId));
    setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Route</h1>
          <p className="text-gray-600 mt-1">
            Plan and optimize your delivery route
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Route Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Route Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Morning Delivery Route"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Route description..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="vehicleId">Assign Vehicle</Label>
                  <Select
                    onValueChange={(value: string) => setValue('vehicleId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles?.map((vehicle: any) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {vehicle.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scheduledStartTime">Start Time</Label>
                  <Input
                    id="scheduledStartTime"
                    type="datetime-local"
                    {...register('scheduledStartTime')}
                  />
                </div>

                <div>
                  <Label htmlFor="scheduledEndTime">End Time (Optional)</Label>
                  <Input
                    id="scheduledEndTime"
                    type="datetime-local"
                    {...register('scheduledEndTime')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Available Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Available Tasks ({tasks?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {tasks?.map((task: any) => (
                    <div
                      key={task.id}
                      className={`p-3 border rounded-lg ${
                        selectedTaskIds.includes(task.id)
                          ? 'bg-blue-50 border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {task.address || 'No address'}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {task.type}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.priority === 'urgent'
                                  ? 'bg-red-100 text-red-700'
                                  : task.priority === 'high'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        {selectedTaskIds.includes(task.id) ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveTask(task.id)}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAddTask(task.id)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Route Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Route Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Waypoints:</span>
                    <span className="font-semibold">{waypoints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasks:</span>
                    <span className="font-semibold">{selectedTaskIds.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Est. Distance:</span>
                    <span className="font-semibold">-- km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Est. Duration:</span>
                    <span className="font-semibold">-- min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || waypoints.length < 2}
              >
                <Save className="w-4 h-4 mr-2" />
                Create Route
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Route Planner</CardTitle>
              </CardHeader>
              <CardContent>
                <RoutePlannerMap
                  waypoints={waypoints}
                  onWaypointsChange={setWaypoints}
                  height="calc(100vh - 200px)"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}