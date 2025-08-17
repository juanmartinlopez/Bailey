import { useCallback, useState } from "react";
import { getCoordinatesFromAddress } from "../services/deliveryService";
import type { LocationCoordinates } from "../types";

interface UseMapIntegrationReturn {
  coordinates: LocationCoordinates | null;
  isGeocoding: boolean;
  isGettingLocation: boolean;
  error: string | null;
  geocodeAddress: (address: string) => Promise<void>;
  setCoordinates: (coords: LocationCoordinates) => void;
  clearCoordinates: () => void;
  getAddressFromCoordinates: (
    coords: LocationCoordinates
  ) => Promise<string | null>;
  getCurrentLocation: () => Promise<LocationCoordinates | null>;
}

export function useMapIntegration(): UseMapIntegrationReturn {
  const [coordinates, setCoordinatesState] =
    useState<LocationCoordinates | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geocoding: dirección → coordenadas
  const geocodeAddress = useCallback(async (address: string) => {
    if (!address.trim()) {
      setError("La dirección es requerida");
      return;
    }

    setIsGeocoding(true);
    setError(null);

    try {
      const coords = await getCoordinatesFromAddress(address);
      setCoordinatesState(coords);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al buscar la dirección"
      );
      setCoordinatesState(null);
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Reverse geocoding: coordenadas → dirección (usando Nominatim)
  const getAddressFromCoordinates = useCallback(
    async (coords: LocationCoordinates): Promise<string | null> => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1&accept-language=es`;

        const response = await fetch(url, {
          headers: {
            "User-Agent": "Bailey-Burger-App/1.0",
            Referer: window.location.origin,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.display_name) {
          // Intentar extraer una dirección más limpia y estructurada
          const address = data.address || {};

          // Construir dirección en formato argentino
          const houseNumber = address.house_number || "";
          const street = address.road || address.street || "";
          const city =
            address.city || address.town || address.village || "San Juan";
          const state = address.state || "San Juan";

          if (street) {
            const cleanAddress = `${street}${
              houseNumber ? " " + houseNumber : ""
            }, ${city}, ${state}`;
            console.log(`📍 Dirección estructurada: ${cleanAddress}`);
            return cleanAddress;
          }

          // Si no se puede estructurar, devolver la dirección completa
          return data.display_name;
        }

        return null;
      } catch (err) {
        console.error("Error en reverse geocoding:", err);
        return null;
      }
    },
    []
  );

  const setCoordinates = useCallback((coords: LocationCoordinates) => {
    setCoordinatesState(coords);
    setError(null);
  }, []);

  const clearCoordinates = useCallback(() => {
    setCoordinatesState(null);
    setError(null);
  }, []);

  // Geolocalización: obtener ubicación actual del dispositivo
  const getCurrentLocation =
    useCallback((): Promise<LocationCoordinates | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          setError("La geolocalización no está soportada en este navegador");
          resolve(null);
          return;
        }

        setIsGettingLocation(true);
        setError(null);

        const options: PositionOptions = {
          enableHighAccuracy: true,
          timeout: 10000, // 10 segundos
          maximumAge: 60000, // 1 minuto
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords: LocationCoordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            console.log("📍 Ubicación actual obtenida:", coords);

            // Verificar si está dentro del rango de San Juan
            const inSanJuanBounds =
              coords.lat >= -32.0 &&
              coords.lat <= -31.0 &&
              coords.lng >= -69.2 &&
              coords.lng <= -68.2;

            if (!inSanJuanBounds) {
              console.warn("⚠️ La ubicación actual no está en San Juan");
              setError(
                "Tu ubicación actual no está en San Juan. Puedes ingresar tu dirección manualmente."
              );
            }

            setCoordinatesState(coords);
            setIsGettingLocation(false);
            resolve(coords);
          },
          (error) => {
            let errorMessage = "Error al obtener la ubicación actual";

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  "Permiso denegado. Permite el acceso a la ubicación para usar esta función.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage =
                  "Ubicación no disponible. Verifica tu conexión GPS.";
                break;
              case error.TIMEOUT:
                errorMessage = "Tiempo de espera agotado. Intenta de nuevo.";
                break;
            }

            console.error("Error de geolocalización:", error);
            setError(errorMessage);
            setIsGettingLocation(false);
            resolve(null);
          },
          options
        );
      });
    }, []);

  return {
    coordinates,
    isGeocoding,
    isGettingLocation,
    error,
    geocodeAddress,
    setCoordinates,
    clearCoordinates,
    getAddressFromCoordinates,
    getCurrentLocation,
  };
}
