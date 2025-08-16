export interface Pachata {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export type PachataDatabase = Record<number, Pachata>;
