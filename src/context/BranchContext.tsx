import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import branches from "../DB/Branches";
import { calculateDistanceKm } from "../services/deliveryService";
import type { Branch, Cart } from "../types";

const BRANCH_STORAGE_KEY = "bailey_branch_id";

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch;
  nearestBranch: Branch | null;
  distanceFromUserKm: number | null;
  detectNearestBranch: () => Promise<Branch>;
  setSelectedBranch: (branch: Branch) => void;
  changeBranch: (nextBranch: Branch, currentCart?: Cart) => Promise<boolean>;
}

interface BranchProviderProps {
  children: ReactNode;
}

const getInitialBranch = (): Branch => {
  const fallbackBranch = branches[0];

  try {
    const savedBranchId = localStorage.getItem(BRANCH_STORAGE_KEY);
    if (!savedBranchId) return fallbackBranch;

    const foundBranch = branches.find((branch) => branch.id === savedBranchId);
    return foundBranch ?? fallbackBranch;
  } catch (error) {
    console.error("Error al leer sucursal desde localStorage:", error);
    return fallbackBranch;
  }
};

export const isCartItemAvailableInBranch = (
  item: Cart[number],
  branch: Branch
): boolean => {
  return branch.availableProducts[item.type] ?? false;
};

export const getUnavailableCartItems = (cart: Cart, branch: Branch): Cart => {
  return cart.filter((item) => !isCartItemAvailableInBranch(item, branch));
};

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: BranchProviderProps) {
  const [selectedBranch, setSelectedBranchState] = useState<Branch>(getInitialBranch);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [distanceFromUserKm, setDistanceFromUserKm] = useState<number | null>(null);
  const [hasDetectedBranch, setHasDetectedBranch] = useState(false);

  const setSelectedBranch = useCallback((branch: Branch) => {
    setSelectedBranchState(branch);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BRANCH_STORAGE_KEY, selectedBranch.id);
    } catch (error) {
      console.error("Error al guardar sucursal en localStorage:", error);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (!userCoords) {
      setDistanceFromUserKm(null);
      return;
    }

    const distance = calculateDistanceKm(userCoords, {
      lat: selectedBranch.lat,
      lng: selectedBranch.lng,
    });

    setDistanceFromUserKm(distance);
  }, [selectedBranch, userCoords]);

  const detectNearestBranch = useCallback(async (): Promise<Branch> => {
    if (!navigator.geolocation) {
      return selectedBranch;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserCoords(currentCoords);

          const nearestBranch = branches.reduce((closest, candidate) => {
            const candidateDistance = calculateDistanceKm(currentCoords, {
              lat: candidate.lat,
              lng: candidate.lng,
            });

            const closestDistance = calculateDistanceKm(currentCoords, {
              lat: closest.lat,
              lng: closest.lng,
            });

            return candidateDistance < closestDistance ? candidate : closest;
          }, branches[0]);

          setNearestBranch(nearestBranch);
          setSelectedBranchState(nearestBranch);
          resolve(nearestBranch);
        },
        () => {
          resolve(selectedBranch);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }, [selectedBranch]);

  // Solo detectar sucursal más cercana una sola vez al montar
  useEffect(() => {
    if (!hasDetectedBranch) {
      void detectNearestBranch();
      setHasDetectedBranch(true);
    }
  }, [hasDetectedBranch, detectNearestBranch]);

  const changeBranch = useCallback(
    async (nextBranch: Branch, currentCart: Cart = []) => {
      if (nextBranch.id === selectedBranch.id) {
        return false;
      }

      const unavailableItems = getUnavailableCartItems(currentCart, nextBranch);

      const warningText = unavailableItems.length
        ? `Hay ${unavailableItems.length} producto(s) en tu carrito que no están disponibles en ${nextBranch.name}.`
        : `Vas a cambiar a ${nextBranch.name}.`;

      const result = await Swal.fire({
        title: "Cambiar sucursal",
        text: warningText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cambiar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#9D1309",
      });

      if (!result.isConfirmed) {
        return false;
      }

      setSelectedBranchState(nextBranch);
      return true;
    },
    [selectedBranch.id]
  );

  const value = useMemo(
    () => ({
      branches,
      selectedBranch,
      nearestBranch,
      distanceFromUserKm,
      detectNearestBranch,
      setSelectedBranch,
      changeBranch,
    }),
    [selectedBranch, nearestBranch, distanceFromUserKm, detectNearestBranch, setSelectedBranch, changeBranch]
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export const useBranchContext = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranchContext must be used within a BranchProvider");
  }
  return context;
};
