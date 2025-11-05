import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { Order, CartItem } from "../../types/food-delivery";

// 🛒 Order Services

export const createOrder = async (
  restaurantId: string,
  restaurantName: string,
  restaurantImage: string,
  cartItems: CartItem[],
  deliveryFee: number,
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  }
): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalPrice = subtotal + deliveryFee;

    const orderData = {
      userId: user.uid,
      restaurantId,
      restaurantName,
      restaurantImage,
      items: cartItems.map((item) => ({
        menuId: item.menuId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      deliveryFee,
      totalPrice,
      status: "pending",
      deliveryAddress,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, orderData);

    console.log("✅ Order created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Order[];
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data(),
        createdAt: orderSnap.data().createdAt?.toDate(),
        updatedAt: orderSnap.data().updatedAt?.toDate(),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });

    console.log("✅ Order status updated:", orderId, status);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  try {
    await updateOrderStatus(orderId, "cancelled");
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

// 📊 Get order statistics
export const getOrderStats = async (): Promise<{
  total: number;
  pending: number;
  completed: number;
  totalSpent: number;
}> => {
  try {
    const orders = await getUserOrders();

    return {
      total: orders.length,
      pending: orders.filter((o) =>
        ["pending", "confirmed", "preparing", "delivering"].includes(o.status)
      ).length,
      completed: orders.filter((o) => o.status === "completed").length,
      totalSpent: orders
        .filter((o) => o.status === "completed")
        .reduce((sum, order) => sum + order.totalPrice, 0),
    };
  } catch (error) {
    console.error("Error getting order stats:", error);
    throw error;
  }
};
