export interface Fries {
  id: number;
  name: string;
  price: number;
  image: string;
}

export type FriesDatabase = Record<number, Fries>;
