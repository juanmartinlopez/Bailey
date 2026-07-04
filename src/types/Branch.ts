export interface BranchAvailability {
  burger: boolean;
  fries: boolean;
  pachata: boolean;
  drink: boolean;
  addons: boolean;
}

export interface BranchHours {
  days: string;
  closedDaysLabel: string;
  opensAt: string;
  closesAt: string;
  /** 0 = domingo ... 6 = sábado */
  closedWeekdays: number[];
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
