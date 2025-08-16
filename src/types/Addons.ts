export interface Addons {
  id: number;
  name: string;
  price: number;
}

export type AddDatabase = Record<number, Addons>;
