import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token?: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

    this.socket = io(url, {
      auth: {
        token: token || localStorage.getItem('access_token'),
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
    return this.socket;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      toast.success('Connected to real-time updates');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Failed to connect to real-time updates');
      }
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      toast.error('Real-time update error');
    });

    // Custom events
    this.socket.on('vehicle:position', (data) => {
      this.emit('vehicle:position', data);
    });

    this.socket.on('vehicle:status', (data) => {
      this.emit('vehicle:status', data);
    });

    this.socket.on('task:update', (data) => {
      this.emit('task:update', data);
    });

    this.socket.on('route:update', (data) => {
      this.emit('route:update', data);
    });

    this.socket.on('delivery:update', (data) => {
      this.emit('delivery:update', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  subscribeToVehicle(vehicleId: string) {
    this.socket?.emit('vehicle:subscribe', vehicleId);
  }

  unsubscribeFromVehicle(vehicleId: string) {
    this.socket?.emit('vehicle:unsubscribe', vehicleId);
  }

  subscribeToRoute(routeId: string) {
    this.socket?.emit('route:subscribe', routeId);
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const ws = new WebSocketClient();
export default ws;