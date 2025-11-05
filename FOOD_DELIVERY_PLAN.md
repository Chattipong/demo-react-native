# 🍔 Food Delivery App - Development Plan

## 📋 Features

### Phase 1: Basic Setup ✅
- [x] Firebase Authentication
- [x] Navigation structure
- [ ] Firestore data structure
- [ ] Sample data seed

### Phase 2: Restaurant Features
- [ ] Restaurant list screen
- [ ] Restaurant detail screen
- [ ] Menu items display
- [ ] Search & Filter
- [ ] Categories

### Phase 3: Cart & Orders
- [ ] Add to cart
- [ ] Cart screen
- [ ] Place order (no payment)
- [ ] Order history
- [ ] Order tracking (status)

### Phase 4: User Features
- [ ] User profile
- [ ] Delivery addresses
- [ ] Favorite restaurants
- [ ] Order notifications

## 🗄️ Firestore Collections

```javascript
// restaurants
{
  id: string,
  name: string,
  image: string,
  coverImage: string,
  category: string, // "thai", "japanese", "western", etc.
  rating: number,
  deliveryTime: string, // "20-30 min"
  deliveryFee: number,
  minimumOrder: number,
  isOpen: boolean,
  address: string,
  createdAt: timestamp
}

// menus (subcollection of restaurants)
restaurants/{restaurantId}/menus/{menuId}
{
  id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  category: string, // "main", "appetizer", "dessert", "drink"
  isAvailable: boolean,
  isPopular: boolean
}

// orders
{
  id: string,
  userId: string,
  restaurantId: string,
  restaurantName: string,
  items: [
    {
      menuId: string,
      name: string,
      price: number,
      quantity: number,
      image: string
    }
  ],
  subtotal: number,
  deliveryFee: number,
  totalPrice: number,
  status: "pending" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled",
  deliveryAddress: {
    name: string,
    phone: string,
    address: string,
    note: string
  },
  createdAt: timestamp,
  updatedAt: timestamp
}

// users/{userId}
{
  email: string,
  displayName: string,
  photoURL: string,
  phone: string,
  addresses: [
    {
      id: string,
      name: string, // "บ้าน", "ที่ทำงาน"
      address: string,
      phone: string,
      isDefault: boolean
    }
  ],
  favoriteRestaurants: [restaurantId],
  createdAt: timestamp
}
```

## 🎨 Screen Structure

```
app/
  (auth)/
    login.tsx ✅
    register.tsx ✅
    
  (main)/
    index.tsx → Home (Restaurant List)
    restaurant/
      [id].tsx → Restaurant Detail
    cart.tsx → Shopping Cart
    orders/
      index.tsx → Order History
      [id].tsx → Order Detail
    profile.tsx ✅
    search.tsx → Search Screen
```

## 🚀 Next Steps

1. Create Firestore service for restaurants
2. Add sample restaurant data
3. Build restaurant list UI
4. Build restaurant detail UI
5. Implement cart functionality
6. Build order flow
