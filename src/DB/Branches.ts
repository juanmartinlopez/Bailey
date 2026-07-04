import type { Branch } from "../types";

const branches: Branch[] = [
  {
    id: "Villa Krause",
    name: "Sucursal Villa Krause",
    address: "Villa Krause, San Juan",
    phone: "542644842028",
    lat: -31.58846112540744,
    lng: -68.53673065273559,
    mapsUrl:
      "https://www.google.com/maps/place/Bailey%E2%80%99s+Burger/@-31.5885324,-68.5386033,17z/data=!3m1!4b1!4m6!3m5!1s0x96813f000b2b0bf9:0x131f144c444bb16e!8m2!3d-31.5885324!4d-68.5367826!16s%2Fg%2F11w9_tyq9b",
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
    phone: "542645058160",
    lat: -31.559084341328013,
    lng: -68.51405792322045,
    mapsUrl:
      "https://www.google.com/maps/place/Bailey's+burger+trinidad/@-31.5577707,-68.5177381,16.25z/data=!4m6!3m5!1s0x96816b001c650499:0x8772a05354bd073f!8m2!3d-31.559086!4d-68.5140587!16s%2Fg%2F11nqy9mwt5",
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
