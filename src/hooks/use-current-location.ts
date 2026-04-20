"use client";

import { useEffect, useState } from "react";
import type { LatLng } from "@/types/domain";

type CurrentLocationState = {
  location: LatLng | null;
  status: "idle" | "locating" | "ready" | "denied" | "error";
};

export function useCurrentLocation(defaultValue: LatLng | null = null) {
  const [state, setState] = useState<CurrentLocationState>({
    location: defaultValue,
    status: defaultValue ? "ready" : "idle"
  });

  useEffect(() => {
    if (!navigator.geolocation || defaultValue) return;

    setState((current) => ({
      ...current,
      status: "locating"
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          status: "ready"
        });
      },
      (error) => {
        setState((current) => ({
          location: current.location,
          status: error.code === error.PERMISSION_DENIED ? "denied" : "error"
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  }, [defaultValue]);

  return state;
}

