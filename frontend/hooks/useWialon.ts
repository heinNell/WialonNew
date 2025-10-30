"use client";

import { useState, useEffect } from "react";

export interface WialonSession {
  token: string | null;
  isConnected: boolean;
  error: string | null;
}

export interface WialonVehicle {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
    speed: number;
    course: number;
  };
  lastUpdate: Date;
  isOnline: boolean;
}

export function useWialon() {
  const [session, setSession] = useState<WialonSession>({
    token: null,
    isConnected: false,
    error: null,
  });
  const [vehicles, setVehicles] = useState<WialonVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initWialon = async () => {
      try {
        setLoading(true);
        
        // Check for stored token first
        let token = process.env.NEXT_PUBLIC_WIALON_TOKEN;
        
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("wialon_token");
          if (storedToken) {
            token = storedToken;
          }
        }
        
        if (!token) {
          setSession({
            token: null,
            isConnected: false,
            error: "Wialon token not configured",
          });
          setLoading(false);
          return;
        }

        setSession({
          token,
          isConnected: true,
          error: null,
        });

        setVehicles([
          {
            id: "wialon_12345",
            name: "Delivery Van 1",
            position: {
              lat: -26.1950,
              lng: 28.0340,
              speed: 45,
              course: 180,
            },
            lastUpdate: new Date(),
            isOnline: true,
          },
        ]);
      } catch (error) {
        setSession({
          token: null,
          isConnected: false,
          error: error instanceof Error ? error.message : "Connection failed",
        });
      } finally {
        setLoading(false);
      }
    };

    initWialon();
  }, []);

  const refreshVehicles = async () => {
    if (!session.isConnected) return;
    console.log("Refreshing vehicles from Wialon...");
  };

  const login = async (token: string) => {
    try {
      setLoading(true);
      
      if (!token) {
        throw new Error("Token is required");
      }

      // In a real implementation, this would validate the token with Wialon API
      // For now, we'll just set it in the session
      setSession({
        token,
        isConnected: true,
        error: null,
      });

      // Store token in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("wialon_token", token);
      }

      // Mock fetching vehicles with the new token
      setVehicles([
        {
          id: "wialon_12345",
          name: "Delivery Van 1",
          position: {
            lat: -26.195,
            lng: 28.034,
            speed: 45,
            course: 180,
          },
          lastUpdate: new Date(),
          isOnline: true,
        },
      ]);
    } catch (error) {
      setSession({
        token: null,
        isConnected: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession({
      token: null,
      isConnected: false,
      error: null,
    });
    setVehicles([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("wialon_token");
    }
  };

  return {
    session,
    vehicles,
    loading,
    refreshVehicles,
    login,
    logout,
  };
}
