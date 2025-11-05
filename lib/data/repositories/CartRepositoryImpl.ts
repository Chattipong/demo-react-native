// Repository Implementation (Adapter)
// Implements the domain interface

import { Cart } from "../../domain/entities/Cart";
import { ICartRepository } from "../../domain/repositories/ICartRepository";
import { LocalCartDataSource } from "../datasources/LocalCartDataSource";

export class CartRepositoryImpl implements ICartRepository {
  constructor(private localDataSource: LocalCartDataSource) {}

  async getCart(): Promise<Cart> {
    return this.localDataSource.getCart();
  }

  async saveCart(cart: Cart): Promise<void> {
    return this.localDataSource.saveCart(cart);
  }

  async clearCart(): Promise<void> {
    return this.localDataSource.clearCart();
  }
}
