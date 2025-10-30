'use client';  

import { useVehicles } from '@/hooks/useVehicles';  
import { useState } from 'react';  

export default function VehiclesPage() {  
  const { vehicles, isLoading, refresh } = useVehicles();  
  const [filter, setFilter] = useState<'all' | 'active' | 'idle' | 'offline'>('all');  
  const [searchQuery, setSearchQuery] = useState('');  

  const filteredVehicles = vehicles.filter(vehicle => {  
    // Search filter  
    if (searchQuery && !vehicle.nm.toLowerCase().includes(searchQuery.toLowerCase())) {