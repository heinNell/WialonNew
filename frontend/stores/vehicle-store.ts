import { create } from 'zustand';
import api from '@/lib/api';
import ws from '@/lib/websocket';

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

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  fetchVehicles: () => Promise<void>;
  selectVehicle: (id: string) => void;
  updateVehiclePosition: (vehicleId: string, position: any) => void;
  subscribeToVehicle: (vehicleId: string) => void;
  unsubscribeFromVehicle: (vehicleId: string) => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,

  fetchVehicles: async () => {
    set({ isLoading: true });
    try {
      const vehicles = await api.getVehicles();
      set({ vehicles, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  selectVehicle: (id: string) => {
    const vehicle = get().vehicles.find((v) => v.id === id);
    set({ selectedVehicle: vehicle || null });
  },

  updateVehiclePosition: (vehicleId: string, position: any) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              currentLat: position.lat,
              currentLng: position.lng,
              currentSpeed: position.speed,
              isOnline: true,
            }
          : v
      ),
    }));
  },

  subscribeToVehicle: (vehicleId: string) => {
    ws.subscribeToVehicle(vehicleId);
    ws.on('vehicle:position', (data: any) => {
      if (data.vehicleId === vehicleId) {
        get().updateVehiclePosition(vehicleId, data.position);
      }
    });
  },

  unsubscribeFromVehicle: (vehicleId: string) => {
    ws.unsubscribeFromVehicle(vehicleId);
  },
}));