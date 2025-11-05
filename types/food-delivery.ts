// Types for Food Delivery App

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  image: string;
  coverImage?: string;
  category: string; // "thai", "japanese", "western", "chinese", "cafe"
  rating: number;
  deliveryTime: string; // "20-30 min"
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  address: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string; // "main", "appetizer", "dessert", "drink", "side"
  isAvailable: boolean;
  isPopular: boolean;
}

export interface CartItem {
  id: string; // Unique cart item ID
  menuId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface DeliveryAddress {
  id: string;
  name: string; // "บ้าน", "ที่ทำงาน", etc.
  address: string;
  phone: string;
  note?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: {
    menuId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "delivering"
    | "completed"
    | "cancelled";
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  addresses: DeliveryAddress[];
  favoriteRestaurants: string[];
  createdAt: Date;
}
