import type { Branch } from "../types";

const branches: Branch[] = [
  {
    id: "centro",
    name: "Sucursal Centro",
    address: "Villa Krause, San Juan",
    phone: "542644842028",
    lat: -31.5375,
    lng: -68.5364,
    availableProducts: {
      burger: true,
      fries: true,
      pachata: true,
      drink: true,
      addons: true,
    },
  },
  {
    id: "sur",
    name: "Sucursal Sur",
    address: "Rawson, San Juan",
    phone: "542644842028",
    lat: -31.569,
    lng: -68.541,
    availableProducts: {
      burger: true,
      fries: true,
      pachata: false,
      drink: true,
      addons: true,
    },
  },
];

export default branches;
