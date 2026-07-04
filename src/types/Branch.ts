export interface BranchAvailability {
  burger: boolean;
  fries: boolean;
  pachata: boolean;
  drink: boolean;
  addons: boolean;
}

export interface BranchHours {
  days: string;
  opensAt: string;
  closesAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  hours: BranchHours;
  availableProducts: BranchAvailability;
}
