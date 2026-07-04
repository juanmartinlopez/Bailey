import type { Branch } from "../types";

const branches: Branch[] = [
  {
    id: "Villa Krause",
    name: "Sucursal Villa Krause",
    address: "Villa Krause, San Juan",
    phone: "542644842028",
    lat: -31.58846112540744,
    lng: -68.53673065273559,
    hours: {
      days: "Lun a Dom",
      opensAt: "11:00",
      closesAt: "23:30",
    },
    availableProducts: {
      burger: true,
      fries: true,
      pachata: true,
      drink: true,
      addons: true,
    },
  },
  {
    id: "Rawson",
    name: "Sucursal Rawson",
    address: "Rawson, San Juan",
    phone: "542644842028",
    lat: -31.559084341328013,
    lng: -68.51405792322045, 
    hours: {
      days: "Lun a Dom",
      opensAt: "11:00",
      closesAt: "23:00",
    },
    availableProducts: {
      burger: true,
      fries: true,
      pachata: true,
      drink: true,
      addons: true,
    },
  },
];

export default branches;
