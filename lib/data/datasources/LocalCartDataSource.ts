// Data Layer: Local Data Source
// Handles AsyncStorage operations

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cart } from "../../domain/entities/Cart";

const CART_STORAGE_KEY = "@food_delivery_cart";

export class LocalCartDataSource {
  async getCart(): Promise<Cart> {
    try {
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (!cartJson) {
        return new Cart();
      }

      const data = JSON.parse(cartJson);
      return new Cart(
        data.items || [],
        data.restaurantId || null,
        data.restaurantName || null,
        data.deliveryFee || 0
      );
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      return new Cart();
    }
  }

  async saveCart(cart: Cart): Promise<void> {
    try {
      const cartJson = JSON.stringify({
        items: cart.items,
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurantName,
        deliveryFee: cart.deliveryFee,
      });
      await AsyncStorage.setItem(CART_STORAGE_KEY, cartJson);
    } catch (error) {
      console.error("Error saving cart to storage:", error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing cart from storage:", error);
      throw error;
    }
  }
}
