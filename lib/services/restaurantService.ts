import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Restaurant, MenuItem } from "../../types/food-delivery";

// 🏪 Restaurant Services

export const addRestaurant = async (
  restaurantData: Omit<Restaurant, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const restaurantsRef = collection(db, "restaurants");
    const docRef = await addDoc(restaurantsRef, {
      ...restaurantData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding restaurant:", error);
    throw error;
  }
};

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const restaurantsRef = collection(db, "restaurants");
    const q = query(restaurantsRef, orderBy("rating", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "ไม่มีชื่อ",
        description: data.description || "ไม่มีคำอธิบาย",
        image:
          data.image || "https://via.placeholder.com/400x200?text=Restaurant",
        category: data.category || "thai",
        rating: data.rating || 4.0,
        deliveryTime: data.deliveryTime || "30-40 นาที",
        deliveryFee: data.deliveryFee || 0,
        minimumOrder: data.minimumOrder || 0,
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        address: data.address || "ไม่ระบุที่อยู่",
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Restaurant;
    });
  } catch (error) {
    console.error("Error getting restaurants:", error);
    throw error;
  }
};

export const getRestaurantById = async (
  restaurantId: string
): Promise<Restaurant | null> => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (restaurantSnap.exists()) {
      const data = restaurantSnap.data();
      return {
        id: restaurantSnap.id,
        name: data.name || "ไม่มีชื่อ",
        description: data.description || "ไม่มีคำอธิบาย",
        image:
          data.image || "https://via.placeholder.com/400x200?text=Restaurant",
        category: data.category || "thai",
        rating: data.rating || 4.0,
        deliveryTime: data.deliveryTime || "30-40 นาที",
        deliveryFee: data.deliveryFee || 0,
        minimumOrder: data.minimumOrder || 0,
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        address: data.address || "ไม่ระบุที่อยู่",
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Restaurant;
    }
    return null;
  } catch (error) {
    console.error("Error getting restaurant:", error);
    throw error;
  }
};

export const getRestaurantsByCategory = async (
  category: string
): Promise<Restaurant[]> => {
  try {
    const restaurantsRef = collection(db, "restaurants");
    const q = query(
      restaurantsRef,
      where("category", "==", category),
      orderBy("rating", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "ไม่มีชื่อ",
        description: data.description || "ไม่มีคำอธิบาย",
        image:
          data.image || "https://via.placeholder.com/400x200?text=Restaurant",
        category: data.category || "thai",
        rating: data.rating || 4.0,
        deliveryTime: data.deliveryTime || "30-40 นาที",
        deliveryFee: data.deliveryFee || 0,
        minimumOrder: data.minimumOrder || 0,
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        address: data.address || "ไม่ระบุที่อยู่",
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Restaurant;
    });
  } catch (error) {
    console.error("Error getting restaurants by category:", error);
    throw error;
  }
};

export const searchRestaurants = async (
  searchTerm: string
): Promise<Restaurant[]> => {
  try {
    // Note: Firestore doesn't support full-text search
    // For production, consider using Algolia or similar
    const restaurantsRef = collection(db, "restaurants");
    const querySnapshot = await getDocs(restaurantsRef);

    const restaurants = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "ไม่มีชื่อ",
        description: data.description || "ไม่มีคำอธิบาย",
        image:
          data.image || "https://via.placeholder.com/400x200?text=Restaurant",
        category: data.category || "thai",
        rating: data.rating || 4.0,
        deliveryTime: data.deliveryTime || "30-40 นาที",
        deliveryFee: data.deliveryFee || 0,
        minimumOrder: data.minimumOrder || 0,
        isOpen: data.isOpen !== undefined ? data.isOpen : true,
        address: data.address || "ไม่ระบุที่อยู่",
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Restaurant;
    });

    // Client-side filtering
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};

// 🍽️ Menu Services

export const getRestaurantMenus = async (
  restaurantId: string
): Promise<MenuItem[]> => {
  try {
    const menusRef = collection(db, "restaurants", restaurantId, "menus");
    const q = query(menusRef, where("isAvailable", "==", true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        restaurantId,
        name: data.name || "ไม่มีชื่อเมนู",
        description: data.description || "",
        price: data.price || 0,
        image: data.image || "https://via.placeholder.com/200x200?text=Menu",
        category: data.category || "main",
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        isPopular: data.isPopular || false,
      } as MenuItem;
    });
  } catch (error) {
    console.error("Error getting menus:", error);
    throw error;
  }
};

export const getMenusByCategory = async (
  restaurantId: string,
  category: string
): Promise<MenuItem[]> => {
  try {
    const menusRef = collection(db, "restaurants", restaurantId, "menus");
    const q = query(
      menusRef,
      where("category", "==", category),
      where("isAvailable", "==", true)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        restaurantId,
        name: data.name || "ไม่มีชื่อเมนู",
        description: data.description || "",
        price: data.price || 0,
        image: data.image || "https://via.placeholder.com/200x200?text=Menu",
        category: data.category || "main",
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        isPopular: data.isPopular || false,
      } as MenuItem;
    });
  } catch (error) {
    console.error("Error getting menus by category:", error);
    throw error;
  }
};

export const getPopularMenus = async (
  restaurantId: string
): Promise<MenuItem[]> => {
  try {
    const menusRef = collection(db, "restaurants", restaurantId, "menus");
    const q = query(
      menusRef,
      where("isPopular", "==", true),
      where("isAvailable", "==", true),
      limit(6)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        restaurantId,
        name: data.name || "ไม่มีชื่อเมนู",
        description: data.description || "",
        price: data.price || 0,
        image: data.image || "https://via.placeholder.com/200x200?text=Menu",
        category: data.category || "main",
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        isPopular: data.isPopular || false,
      } as MenuItem;
    });
  } catch (error) {
    console.error("Error getting popular menus:", error);
    throw error;
  }
};
