export interface Burger {
  id: number;
  name: string;
  description: string;
  image: string;
  priceSimple: number;
  priceDoble: number;
  priceTriple: number;
}

export type BurgerDatabase = Record<number, Burger>;
