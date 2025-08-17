import type { Addons, Burger, Drink, Fries, Pachata } from ".";

export interface CartItemBase {
  id: string; // ID único para cada item en el carrito
  quantity: number;
  comment: string;
  addons: Addons[];
  totalPrice: number;
  type: "burger" | "fries" | "pachata" | "drink";
}

export interface CartBurgerItem extends CartItemBase {
  type: "burger";
  product: Burger;
  size: "Simple" | "Doble" | "Triple";
}

export interface CartFriesItem extends CartItemBase {
  type: "fries";
  product: Fries;
}

export interface CartPachataItem extends CartItemBase {
  type: "pachata";
  product: Pachata;
}

export interface CartDrinkItem extends CartItemBase {
  type: "drink";
  product: Drink;
}

export type CartItem =
  | CartBurgerItem
  | CartFriesItem
  | CartPachataItem
  | CartDrinkItem;

export type Cart = CartItem[];
