export interface DeliveryZone {
  id: number;
  name: string;
  price: number;
  minDistance?: number;
  maxDistance?: number;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface DeliveryCalculation {
  distance: number;
  zone: DeliveryZone;
  price: number;
}
