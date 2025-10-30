import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message =
          error.response?.data?.message || 'An error occurred';

        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        toast.error(message);
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  // Auth endpoints
  async register(data: any) {
    const response = await this.client.post('/auth/register', data);
    this.setToken(response.data.access_token);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
    });
    this.setToken(response.data.access_token);
    return response.data;
  }

  async logout() {
    this.clearToken();
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  // Vehicles
  async getVehicles(filters?: any) {
    const response = await this.client.get('/vehicles', { params: filters });
    return response.data;
  }

  async getVehicle(id: string) {
    const response = await this.client.get(`/vehicles/${id}`);
    return response.data;
  }

  async getVehicleStatistics(id: string) {
    const response = await this.client.get(`/vehicles/${id}/statistics`);
    return response.data;
  }

  async getVehicleTrack(id: string, from: Date, to: Date) {
    const response = await this.client.get(`/vehicles/${id}/track`, {
      params: { from: from.toISOString(), to: to.toISOString() },
    });
    return response.data;
  }

  async syncVehicles() {
    const response = await this.client.post('/vehicles/sync');
    return response.data;
  }

  // Tasks
  async getTasks(filters?: any) {
    const response = await this.client.get('/logistics/tasks', {
      params: filters,
    });
    return response.data;
  }

  async getTask(id: string) {
    const response = await this.client.get(`/logistics/tasks/${id}`);
    return response.data;
  }

  async createTask(data: any) {
    const response = await this.client.post('/logistics/tasks', data);
    return response.data;
  }

  async updateTask(id: string, data: any) {
    const response = await this.client.put(`/logistics/tasks/${id}`, data);
    return response.data;
  }

  async updateTaskStatus(id: string, status: string, notes?: string) {
    const response = await this.client.put(`/logistics/tasks/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  }

  async deleteTask(id: string) {
    const response = await this.client.delete(`/logistics/tasks/${id}`);
    return response.data;
  }

  async getTaskStatistics(filters?: any) {
    const response = await this.client.get('/logistics/tasks/statistics', {
      params: filters,
    });
    return response.data;
  }

  // Routes
  async getRoutes(filters?: any) {
    const response = await this.client.get('/logistics/routes', {
      params: filters,
    });
    return response.data;
  }

  async getRoute(id: string) {
    const response = await this.client.get(`/logistics/routes/${id}`);
    return response.data;
  }

  async createRoute(data: any) {
    const response = await this.client.post('/logistics/routes', data);
    return response.data;
  }

  async updateRoute(id: string, data: any) {
    const response = await this.client.put(`/logistics/routes/${id}`, data);
    return response.data;
  }

  async optimizeRoute(id: string) {
    const response = await this.client.post(`/logistics/routes/${id}/optimize`);
    return response.data;
  }

  async getRouteProgress(id: string) {
    const response = await this.client.get(`/logistics/routes/${id}/progress`);
    return response.data;
  }

  async deleteRoute(id: string) {
    const response = await this.client.delete(`/logistics/routes/${id}`);
    return response.data;
  }

  // Deliveries
  async trackDelivery(trackingNumber: string) {
    const response = await this.client.get(
      `/logistics/deliveries/track/${trackingNumber}`
    );
    return response.data;
  }

  async updateDeliveryStatus(id: string, status: string, metadata?: any) {
    const response = await this.client.put(
      `/logistics/deliveries/${id}/status`,
      { status, metadata }
    );
    return response.data;
  }

  async addProofOfDelivery(id: string, proof: any) {
    const response = await this.client.put(
      `/logistics/deliveries/${id}/proof`,
      proof
    );
    return response.data;
  }

  // Generic request
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request(config);
    return response.data;
  }
}

export const api = new APIClient();
export default api;