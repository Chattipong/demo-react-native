// Domain Layer: Use Cases
// Business logic operations

import { Cart, CartItem } from "../entities/Cart";
import { ICartRepository } from "../repositories/ICartRepository";

export interface AddToCartParams {
  menuId: string;
  name: string;
  price: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  deliveryFee: number;
  quantity?: number;
}

export class CartUseCases {
  constructor(private repository: ICartRepository) {}

  async addToCart(params: AddToCartParams): Promise<{
    success: boolean;
    cart: Cart;
    error?: string;
  }> {
    try {
      const currentCart = await this.repository.getCart();

      // Check if can add item from this restaurant
      if (!currentCart.canAddItem(params.restaurantId)) {
        return {
          success: false,
          cart: currentCart,
          error: "DIFFERENT_RESTAURANT",
        };
      }

      // Add or update item
      const existingItem = currentCart.findItem(params.menuId);

      if (existingItem) {
        existingItem.quantity += params.quantity || 1;
      } else {
        const newItem: CartItem = {
          id: `${params.menuId}_${Date.now()}`,
          menuId: params.menuId,
          name: params.name,
          price: params.price,
          quantity: params.quantity || 1,
          image: params.image,
          restaurantId: params.restaurantId,
          restaurantName: params.restaurantName,
        };
        currentCart.items.push(newItem);

        // Set restaurant info if first item
        if (currentCart.items.length === 1) {
          currentCart.restaurantId = params.restaurantId;
          currentCart.restaurantName = params.restaurantName;
          currentCart.deliveryFee = params.deliveryFee;
        }
      }

      await this.repository.saveCart(currentCart);
      return { success: true, cart: currentCart };
    } catch (error: any) {
      console.error("Error in addToCart:", error);
      throw error;
    }
  }

  async updateQuantity(
    itemId: string,
    quantity: number
  ): Promise<{ success: boolean; cart: Cart }> {
    const currentCart = await this.repository.getCart();

    if (quantity <= 0) {
      return this.removeItem(itemId);
    }

    const item = currentCart.items.find((item) => item.id === itemId);
    if (item) {
      item.quantity = quantity;
    }

    await this.repository.saveCart(currentCart);
    return { success: true, cart: currentCart };
  }

  async removeItem(itemId: string): Promise<{ success: boolean; cart: Cart }> {
    const currentCart = await this.repository.getCart();

    currentCart.items = currentCart.items.filter((item) => item.id !== itemId);

    // Clear restaurant info if no items left
    if (currentCart.items.length === 0) {
      currentCart.restaurantId = null;
      currentCart.restaurantName = null;
      currentCart.deliveryFee = 0;
    }

    await this.repository.saveCart(currentCart);
    return { success: true, cart: currentCart };
  }

  async clearCart(): Promise<{ success: boolean; cart: Cart }> {
    await this.repository.clearCart();
    const emptyCart = new Cart();
    return { success: true, cart: emptyCart };
  }

  async getCart(): Promise<Cart> {
    return await this.repository.getCart();
  }
}
