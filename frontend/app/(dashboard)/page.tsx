'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, ClipboardList, Route, TrendingUp } from 'lucide-react';
import VehicleMap from '@/components/map/vehicle-map';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.getVehicles(),
  });
  
  const { data: taskStats } = useQuery({
    queryKey: ['task-statistics'],
    queryFn: () => api.getTaskStatistics(),
  });
  
  const stats = [
    {
      title: 'Total Vehicles',
      value: vehicles?.length || 0,
      change: '+2.5%',
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Tasks',
      value: taskStats?.inProgress || 0,
      change: '+12.3%',
      icon: ClipboardList,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Completed Today',
      value: taskStats?.completed || 0,
      change: '+8.1%',
      icon: Route,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Efficiency',
      value: '94.5%',
      change: '+3.2%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];
  
  const chartData = [
    { name: 'Mon', completed: 12, pending: 3 },
    { name: 'Tue', completed: 15, pending: 5 },
    { name: 'Wed', completed: 18, pending: 2 },
    { name: 'Thu', completed: 14, pending: 4 },
    { name: 'Fri', completed: 20, pending: 3 },
    { name: 'Sat', completed: 8, pending: 1 },
    { name: 'Sun', completed: 5, pending: 0 },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Map and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Vehicle Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleMap vehicles={vehicles || []} height="400px" />
          </CardContent>
        </Card>
        
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" />
                <Bar dataKey="pending" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium">Task completed</p>
                    <p className="text-sm text-gray-600">Delivery to Customer #{i}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{i} min ago</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}