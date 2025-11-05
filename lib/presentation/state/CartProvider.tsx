// Presentation Layer: State Management
// React Context with Clean Architecture

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Alert } from "react-native";
import Toast from "react-native-root-toast";
import { Cart } from "../../domain/entities/Cart";
import { CartUseCases } from "../../domain/usecases/CartUseCases";
import { CartRepository } from "../../data/repositories/CartRepository";
import { LocalCartDataSource } from "../../data/datasources/LocalCartDataSource";
import { MenuItem } from "../../../types/food-delivery";

// Dependency Injection
const localDataSource = new LocalCartDataSource();
const cartRepository = new CartRepository(localDataSource);
const cartUseCases = new CartUseCases(cartRepository);

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (
    item: MenuItem,
    restaurantId: string,
    restaurantName: string,
    deliveryFee: number,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getItemQuantity: (menuId: string) => number;
  // Computed properties
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  cartItems: any[];
  restaurantInfo: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>(new Cart());
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        backgroundColor: type === "success" ? "#34C759" : "#FF3B30",
        textColor: "#FFFFFF",
        opacity: 0.95,
        containerStyle: {
          borderRadius: 8,
          paddingHorizontal: 20,
          paddingVertical: 12,
        },
      });
    },
    []
  );

  // Define clearCart first (used by addToCart)
  const clearCart = useCallback(async () => {
    try {
      const result = await cartUseCases.clearCart();
      if (result.success) {
        setCart(result.cart);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      showToast("เกิดข้อผิดพลาด", "error");
    }
  }, [showToast]);

  const addToCart = useCallback(
    async (
      item: MenuItem,
      restaurantId: string,
      restaurantName: string,
      deliveryFee: number,
      quantity: number = 1
    ) => {
      try {
        const result = await cartUseCases.addToCart({
          menuId: item.id || "",
          name: item.name,
          price: item.price,
          image: item.image,
          restaurantId,
          restaurantName,
          deliveryFee,
          quantity,
        });

        if (result.success) {
          setCart(result.cart);
        } else if (result.error === "DIFFERENT_RESTAURANT") {
          Alert.alert(
            "ร้านอาหารต่างกัน",
            `คุณมีสินค้าจาก "${cart.restaurantInfo?.name}" อยู่ในตะกร้าแล้ว\nต้องการล้างตะกร้าและเริ่มใหม่หรือไม่?`,
            [
              { text: "ยกเลิก", style: "cancel" },
              {
                text: "ล้างตะกร้า",
                style: "destructive",
                onPress: async () => {
                  await clearCart();
                  const retryResult = await cartUseCases.addToCart({
                    menuId: item.id || "",
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    restaurantId,
                    restaurantName,
                    deliveryFee,
                    quantity,
                  });
                  if (retryResult.success) {
                    setCart(retryResult.cart);
                  }
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        showToast("เกิดข้อผิดพลาด", "error");
      }
    },
    [cart.restaurantInfo, clearCart, showToast]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const result = await cartUseCases.updateQuantity(itemId, quantity);
        if (result.success) {
          setCart(result.cart);
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        showToast("เกิดข้อผิดพลาด", "error");
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      try {
        const result = await cartUseCases.removeItem(itemId);
        if (result.success) {
          setCart(result.cart);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        showToast("เกิดข้อผิดพลาด", "error");
      }
    },
    [showToast]
  );

  const clearCartWithConfirmation = useCallback(() => {
    Alert.alert("ล้างตะกร้า", "ต้องการล้างสินค้าทั้งหมดในตะกร้าใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ล้าง",
        style: "destructive",
        onPress: async () => {
          await clearCart();
        },
      },
    ]);
  }, [clearCart, showToast]);

  const getItemQuantity = useCallback(
    (menuId: string): number => {
      return cart.getItemQuantity(menuId);
    },
    [cart]
  );

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await cartUseCases.getCart();
        setCart(savedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: clearCartWithConfirmation,
    getItemQuantity,
    // Computed properties
    itemCount: cart.itemCount,
    subtotal: cart.subtotal,
    deliveryFee: cart.deliveryFee,
    totalAmount: cart.total,
    cartItems: cart.cartItems,
    restaurantInfo: cart.restaurantInfo,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
