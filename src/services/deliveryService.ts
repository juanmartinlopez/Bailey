import type {
  DeliveryCalculation,
  DeliveryZone,
  LocationCoordinates,
} from "../types";

// Interfaces para el API de Nominatim
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  class?: string;
  type?: string;
}

// Configuración del punto de origen (tu local)
// Fallback: centro de San Juan, Argentina (Plaza 25 de Mayo aprox.)
const STORE_LOCATION: LocationCoordinates = {
  lat: Number(import.meta.env.VITE_STORE_LAT) || -31.5375,
  lng: Number(import.meta.env.VITE_STORE_LNG) || -68.5364,
};

// Convertir los datos de delivery a zonas con rangos de distancia
const deliveryZones: DeliveryZone[] = [
  { id: 1, name: "0-2KM", price: 1700, minDistance: 0, maxDistance: 2 },
  { id: 2, name: "2-3.5KM", price: 1900, minDistance: 2, maxDistance: 3.5 },
  { id: 3, name: "3.5-5KM", price: 2400, minDistance: 3.5, maxDistance: 5 },
  { id: 4, name: "5-6.5KM", price: 2800, minDistance: 5, maxDistance: 6.5 },
  { id: 5, name: "6.5-8KM", price: 3000, minDistance: 6.5, maxDistance: 8 },
  { id: 6, name: "8-10KM", price: 3300, minDistance: 8, maxDistance: 10 },
];

// Caché en memoria para evitar pedir lo mismo repetidamente durante la sesión
const geocodeCache = new Map<string, LocationCoordinates>();

// Utilidad: timeout para fetch (algunos usuarios reportan timeouts de red intermitentes)
async function fetchWithTimeout(url: string, options: RequestInit, ms = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// Detectar si el "address" ya es un par de coordenadas "lat,lng"
function parseCoordinatesString(address: string): LocationCoordinates | null {
  const trimmed = address.trim();
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

/**
 * Obtiene coordenadas de una dirección usando Nominatim (OpenStreetMap)
 * - Detecta y retorna directamente coordenadas si ya vienen como "lat,lng"
 * - Usa caché en memoria para evitar repetición
 * - Implementa timeout y mensaje de error más claro
 * - Mejora la precisión con múltiples estrategias de búsqueda
 */
export async function getCoordinatesFromAddress(
  address: string
): Promise<LocationCoordinates> {
  // 0. Si es un par de coordenadas, devolver directamente
  const coordsDirect = parseCoordinatesString(address);
  if (coordsDirect) return coordsDirect;

  // 1. Caché
  const cacheKey = address.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // 2. Estrategias de búsqueda más simples y efectivas
  const searchStrategies = [
    // Estrategia 1: Con Capital específica
    `${address}, Capital, San Juan, Argentina`,
    // Estrategia 2: Búsqueda básica
    `${address}, San Juan, Argentina`,
    // Estrategia 3: Solo la dirección
    address,
  ];

  let lastError: Error | null = null;

  // Intentar cada estrategia
  for (let i = 0; i < searchStrategies.length; i++) {
    const searchAddress = searchStrategies[i];
    console.log(`🔍 Intentando estrategia ${i + 1}: ${searchAddress}`);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchAddress
    )}&limit=3&addressdetails=1&polygon_geojson=0&countrycodes=ar`;

    try {
      const response = await fetchWithTimeout(
        url,
        {
          headers: {
            "User-Agent": "Bailey-Burger-App/1.0 (contact: dev@example.com)",
            Referer: window.location.origin,
            "Accept-Language": "es,en;q=0.8",
          },
        },
        8000
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.warn(`❌ Estrategia ${i + 1} sin resultados`);
        continue;
      }

      // Filtro más permisivo - aceptar si está en Argentina y rango amplio de San Juan
      const validResults = data.filter((item: NominatimResult) => {
        const displayName = item.display_name?.toLowerCase() || "";
        const hasArgentina = displayName.includes("argentina");

        // Verificar que las coordenadas estén en un rango razonable para San Juan
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const inSanJuanBounds =
          lat >= -32.0 &&
          lat <= -31.0 && // Rango más amplio para San Juan (-31.5 aprox)
          lng >= -69.2 &&
          lng <= -68.2; // Rango más amplio para San Juan (-68.5 aprox)

        console.log(
          `🔍 Verificando: lat=${lat}, lng=${lng}, inBounds=${inSanJuanBounds}, hasArg=${hasArgentina}`
        );

        return hasArgentina && inSanJuanBounds;
      });

      if (validResults.length > 0) {
        // Tomar el primer resultado válido
        const bestResult = validResults[0];
        const result: LocationCoordinates = {
          lat: parseFloat(bestResult.lat),
          lng: parseFloat(bestResult.lon),
        };

        console.log(`✅ Encontrado con estrategia ${i + 1}:`, result);
        console.log(`📍 Dirección completa: ${bestResult.display_name}`);

        geocodeCache.set(cacheKey, result);
        return result;
      }

      console.warn(
        `⚠️ Estrategia ${i + 1} no tiene resultados válidos en San Juan`
      );
    } catch (error: unknown) {
      console.warn(
        `❌ Error en estrategia ${i + 1}:`,
        error instanceof Error ? error.message : String(error)
      );
      lastError = error instanceof Error ? error : new Error(String(error));

      // Si es timeout, intentar con servicio alternativo
      if (error instanceof Error && error.name === "AbortError" && i === 0) {
        console.log("🔄 Intentando servicio alternativo...");
        try {
          const altUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
            searchAddress
          )}&limit=1`;
          const altRes = await fetchWithTimeout(altUrl, {}, 5000);
          if (altRes.ok) {
            const altData = await altRes.json();
            if (Array.isArray(altData) && altData.length > 0) {
              const altResult: LocationCoordinates = {
                lat: parseFloat(altData[0].lat),
                lng: parseFloat(altData[0].lon),
              };

              // Verificar que esté en San Juan
              if (
                altResult.lat >= -32.2 &&
                altResult.lat <= -31.2 &&
                altResult.lng >= -69.0 &&
                altResult.lng <= -68.0
              ) {
                console.log(
                  "✅ Encontrado con servicio alternativo:",
                  altResult
                );
                geocodeCache.set(cacheKey, altResult);
                return altResult;
              }
            }
          }
        } catch (e) {
          console.warn("❌ Servicio alternativo también falló", e);
        }
      }

      // Continuar con la siguiente estrategia
      continue;
    }
  }

  // Si llegamos aquí, ninguna estrategia funcionó
  console.error("❌ Todas las estrategias de geocodificación fallaron");
  throw new Error(
    lastError?.name === "AbortError"
      ? "Timeout al buscar la dirección. Por favor, intenta de nuevo."
      : `No se pudo encontrar la dirección "${address}" en San Juan. Verifica que la calle y número sean correctos.`
  );
}

/**
 * Calcula la distancia real por calles usando OSRM (OpenStreetMap Routing Machine)
 * GRATIS y más preciso que Haversine
 */
export async function calculateRealDistance(
  store: LocationCoordinates,
  client: LocationCoordinates
): Promise<number> {
  // OSRM usa formato longitude,latitude (no latitude,longitude)
  const url = `https://router.project-osrm.org/route/v1/driving/${store.lng},${store.lat};${client.lng},${client.lat}?overview=false&steps=false`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== "Ok") {
      throw new Error(`OSRM error: ${data.code}`);
    }

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No se encontró una ruta");
    }

    // La distancia viene en metros, convertir a kilómetros
    return data.routes[0].distance / 1000;
  } catch (error) {
    console.error("Error calculating distance with OSRM:", error);
    throw new Error("Error calculando distancia por calles");
  }
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * (fallback en caso de que OSRM falle)
 */
function calculateHaversineDistance(
  coord1: LocationCoordinates,
  coord2: LocationCoordinates
): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calcula el costo de envío basado en la distancia
 */
export function calculateDeliveryPrice(
  distance: number
): DeliveryCalculation | null {
  const zone = deliveryZones.find(
    (zone) =>
      distance >= (zone.minDistance || 0) &&
      distance <= (zone.maxDistance || Infinity)
  );

  if (!zone) {
    return null; // Fuera del área de entrega
  }

  return {
    distance,
    zone,
    price: zone.price,
  };
}

/**
 * Función principal: Calcula el costo de envío completo desde una dirección
 * Usa OpenStreetMap (GRATIS) en lugar de Google Maps
 */
export async function calculateFullDelivery(
  address: string
): Promise<DeliveryCalculation | null> {
  try {
    console.log(`🚀 Calculando envío para: ${address}`);

    // 1. Obtener coordenadas usando Nominatim (GRATIS)
    const clientCoordinates = await getCoordinatesFromAddress(address);
    console.log(`📍 Coordenadas cliente:`, clientCoordinates);

    let distance: number;

    try {
      // 2. Calcular distancia real por calles usando OSRM (GRATIS)
      distance = await calculateRealDistance(STORE_LOCATION, clientCoordinates);
      console.log(`🛣️ Distancia real por calles: ${distance.toFixed(2)} km`);
    } catch (osrmError) {
      console.warn("⚠️ OSRM falló, usando Haversine como fallback:", osrmError);
      // Fallback: usar Haversine si OSRM falla
      distance = calculateHaversineDistance(STORE_LOCATION, clientCoordinates);
      console.log(
        `📐 Distancia Haversine (fallback): ${distance.toFixed(2)} km`
      );
    }

    // 3. Determinar costo según zona
    const deliveryCalculation = calculateDeliveryPrice(distance);

    if (deliveryCalculation) {
      console.log(
        `💰 Costo calculado: $${deliveryCalculation.price} (${deliveryCalculation.zone.name})`
      );
    } else {
      console.log(
        `🚫 Fuera del área de entrega (${distance.toFixed(2)} km > 10 km)`
      );
    }

    return deliveryCalculation;
  } catch (error) {
    console.error("❌ Error calculating full delivery:", error);
    return null;
  }
}

/**
 * Función simplificada para calcular solo la distancia y precio
 * (compatible con el código existente)
 */
export async function calculateDelivery(
  address: string
): Promise<{ km: number; price: number | null }> {
  const result = await calculateFullDelivery(address);

  if (result) {
    return {
      km: result.distance,
      price: result.price,
    };
  } else {
    // Si no hay resultado, significa que está fuera del área
    try {
      const clientCoordinates = await getCoordinatesFromAddress(address);
      const distance = calculateHaversineDistance(
        STORE_LOCATION,
        clientCoordinates
      );
      return {
        km: distance,
        price: null, // Fuera del área
      };
    } catch {
      throw new Error("No se pudo calcular la distancia");
    }
  }
}

/**
 * Actualizar la ubicación del local
 */
export function updateStoreLocation(coordinates: LocationCoordinates): void {
  STORE_LOCATION.lat = coordinates.lat;
  STORE_LOCATION.lng = coordinates.lng;
}

/**
 * Obtener la ubicación actual del local
 */
export function getStoreLocation(): LocationCoordinates {
  return { ...STORE_LOCATION };
}
