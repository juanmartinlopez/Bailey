import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LocationCoordinates } from "../../types";

// Fix para los iconos de Leaflet en React
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  initialPosition?: LocationCoordinates;
  onLocationSelect: (coordinates: LocationCoordinates) => void;
  height?: string;
  showMarker?: boolean;
  disabled?: boolean;
}

// Componente interno para manejar clicks en el mapa
function LocationPicker({
  onLocationSelect,
  disabled,
}: {
  onLocationSelect: (coords: LocationCoordinates) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (!disabled) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng });
      }
    },
  });
  return null;
}

// Componente para controlar el mapa y moverlo a las coordenadas
function MapController({ position }: { position: LocationCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      // Hacer flyTo para mover el mapa suavemente a la nueva posición
      map.flyTo([position.lat, position.lng], 15, {
        duration: 1.5, // duración de la animación en segundos
      });
    }
  }, [position, map]);

  return null;
}

function InteractiveMap({
  initialPosition = { lat: -31.5375, lng: -68.5364 }, // San Juan, Argentina por defecto
  onLocationSelect,
  height = "300px",
  showMarker = true,
  disabled = false,
}: LocationPickerProps) {
  const [selectedPosition, setSelectedPosition] =
    useState<LocationCoordinates>(initialPosition);

  const handleLocationSelect = (coordinates: LocationCoordinates) => {
    setSelectedPosition(coordinates);
    onLocationSelect(coordinates);
  };

  useEffect(() => {
    setSelectedPosition(initialPosition);
  }, [initialPosition]);

  return (
    <div className="relative">
      <MapContainer
        center={[initialPosition.lat, initialPosition.lng]}
        zoom={13}
        style={{ height, width: "100%", borderRadius: "8px" }}
        className={disabled ? "pointer-events-none opacity-70" : ""}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Componente para controlar el movimiento del mapa */}
        <MapController position={selectedPosition} />

        {!disabled && (
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            disabled={disabled}
          />
        )}

        {showMarker && selectedPosition && (
          <Marker position={[selectedPosition.lat, selectedPosition.lng]} />
        )}
      </MapContainer>

      {!disabled && (
        <div className="mt-2 text-sm text-gray-600">
          <p>📍 Haz clic en el mapa para seleccionar tu ubicación exacta</p>
          <p className="text-xs">
            Coordenadas: {selectedPosition.lat.toFixed(6)},{" "}
            {selectedPosition.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}

export default InteractiveMap;
