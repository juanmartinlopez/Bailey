import { useCallback, useState } from "react";
import {
  calculateFullDelivery,
  updateStoreLocation,
} from "../services/deliveryService";
import type { DeliveryCalculation, LocationCoordinates } from "../types";

interface UseDeliveryCalculatorReturn {
  calculation: DeliveryCalculation | null;
  isCalculating: boolean;
  error: string | null;
  calculateDelivery: (address: string) => Promise<void>;
  setStoreLocation: (coordinates: LocationCoordinates) => void;
  clearCalculation: () => void;
}

export function useDeliveryCalculator(): UseDeliveryCalculatorReturn {
  const [calculation, setCalculation] = useState<DeliveryCalculation | null>(
    null
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDelivery = useCallback(async (address: string) => {
    if (!address.trim()) {
      setError("La dirección es requerida");
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      // Ahora usa OpenStreetMap (GRATIS) en lugar de Google Maps
      const result = await calculateFullDelivery(address);

      if (result) {
        setCalculation(result);
      } else {
        setError("Dirección fuera del área de entrega (máximo 10km)");
        setCalculation(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al calcular la distancia"
      );
      setCalculation(null);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const setStoreLocation = useCallback((coordinates: LocationCoordinates) => {
    updateStoreLocation(coordinates);
  }, []);

  const clearCalculation = useCallback(() => {
    setCalculation(null);
    setError(null);
  }, []);

  return {
    calculation,
    isCalculating,
    error,
    calculateDelivery,
    setStoreLocation,
    clearCalculation,
  };
}
