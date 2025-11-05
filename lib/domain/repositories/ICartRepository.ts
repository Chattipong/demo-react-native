// Domain Layer: Repository Interface
// Defines contract for data operations

import { Cart } from "../entities/Cart";

export interface ICartRepository {
  getCart(): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
  clearCart(): Promise<void>;
}
