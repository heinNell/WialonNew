'use client';

import { useWialon } from '@/hooks/useWialon';
import { useVehicles } from '@/hooks/useVehicles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { session, loading: sessionLoading } = useWialon();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login');
    }
  }, [session, sessionLoading, router]);

  if (sessionLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeVehicles = vehicles.filter(v => v.pos && v.pos.s > 5).length;
  const idleVehicles = vehicles.filter(v => v.pos && v.pos.s <= 5).length;
  const offlineVehicles = vehicles.filter(v => !v.pos).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Fleet Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user.nm}
              </span>
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Vehicles"
            value={vehicles.length}
            icon="🚗"
            color="blue"
          />
          <StatCard
            title="Active"
            value={activeVehicles}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Idle"
            value={idleVehicles}
            icon="⊘"
            color="yellow"
          />
          <StatCard
            title="Offline"
            value={offlineVehicles}
            icon="❌"
            color="red"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickAction
            title="View Vehicles"
            icon="🚙"
            href="/vehicles"
          />
          <QuickAction
            title="Geofences"
            icon="📍"
            href="/geofences"
          />
          <QuickAction
            title="Reports"
            icon="📊"
            href="/reports"
          />
        </div>

        {/* Recent Vehicles */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {vehicles.slice(0, 5).map(vehicle => (
              <VehicleRow key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-4xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, icon, href }: any) {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(href)}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">Click to manage</p>
    </button>
  );
}

function VehicleRow({ vehicle }: any) {
  const status = !vehicle.pos ? 'offline' :
                 vehicle.pos.s > 5 ? 'active' : 'idle';
  
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    idle: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-red-100 text-red-800'
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl">🚗</div>
          <div>
            <h4 className="font-medium text-gray-900">{vehicle.nm}</h4>
            <p className="text-sm text-gray-600">ID: {vehicle.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {vehicle.pos && (
            <div className="text-right text-sm">
              <p className="text-gray-900 font-medium">{vehicle.pos.s} km/h</p>
              <p className="text-gray-600">{vehicle.pos.y.toFixed(4)}, {vehicle.pos.x.toFixed(4)}</p>
            </div>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}