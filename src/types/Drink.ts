export interface Drink {
  id: number;
  name: string;
  price: number;
}

export type DrinkDatabase = Record<number, Drink>;
