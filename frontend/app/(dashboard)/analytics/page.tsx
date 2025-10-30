'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { downloadCSV } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('tasks');

  const { data: taskStats } = useQuery({
    queryKey: ['task-statistics', timeRange],
    queryFn: () => api.getTaskStatistics({ range: timeRange }),
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.getVehicles(),
  });

  // Mock data for charts
  const weeklyPerformance = [
    { day: 'Mon', completed: 12, failed: 1, pending: 3 },
    { day: 'Tue', completed: 15, failed: 2, pending: 5 },
    { day: 'Wed', completed: 18, failed: 1, pending: 2 },
    { day: 'Thu', completed: 14, failed: 0, pending: 4 },
    { day: 'Fri', completed: 20, failed: 2, pending: 3 },
    { day: 'Sat', completed: 8, failed: 1, pending: 1 },
    { day: 'Sun', completed: 5, failed: 0, pending: 0 },
  ];

  const vehicleUtilization = vehicles?.map((v: any) => ({
    name: v.name,
    value: Math.floor(Math.random() * 100),
  })) || [];

  const taskDistribution = [
    { name: 'Delivery', value: 45 },
    { name: 'Pickup', value: 25 },
    { name: 'Service', value: 20 },
    { name: 'Maintenance', value: 10 },
  ];

  const monthlyTrend = [
    { month: 'Jan', tasks: 320, distance: 4500 },
    { month: 'Feb', tasks: 380, distance: 5200 },
    { month: 'Mar', tasks: 450, distance: 6100 },
    { month: 'Apr', tasks: 420, distance: 5800 },
    { month: 'May', tasks: 510, distance: 7200 },
    { month: 'Jun', tasks: 490, distance: 6900 },
  ];

  const exportData = () => {
    const data = weeklyPerformance.map((d) => ({
      Day: d.day,
      Completed: d.completed,
      Failed: d.failed,
      Pending: d.pending,
    }));
    downloadCSV(data, 'analytics-export.csv');
    toast.success('Data exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track performance and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,284</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-2">94.5%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+3.2%</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Distance</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">42.3 km</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">-5.1%</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fuel Efficiency</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">8.2 L</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">-2.3%</span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <div className="w-6 h-6 bg-orange-600 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" fill="#3b82f6" name="Pending" />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  name="Tasks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicleUtilization.slice(0, 5).map((vehicle: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{vehicle.name}</span>
                    <span className="text-sm text-gray-600">{vehicle.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${vehicle.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tasks</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Distance</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Success Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Driver {i}</td>
                    <td className="py-3 px-4">{120 - i * 10}</td>
                    <td className="py-3 px-4">{5000 - i * 500} km</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-semibold">
                        {100 - i}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, idx) => (
                          <span
                            key={idx}
                            className={idx < 5 - i ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}