// Data Layer: Repository Implementation
// Implements domain repository interface

import { Cart } from "../../domain/entities/Cart";
import { ICartRepository } from "../../domain/repositories/ICartRepository";
import { LocalCartDataSource } from "../datasources/LocalCartDataSource";

export class CartRepository implements ICartRepository {
  constructor(private localDataSource: LocalCartDataSource) {}

  async getCart(): Promise<Cart> {
    return await this.localDataSource.getCart();
  }

  async saveCart(cart: Cart): Promise<void> {
    await this.localDataSource.saveCart(cart);
  }

  async clearCart(): Promise<void> {
    await this.localDataSource.clearCart();
  }
}
