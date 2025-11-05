# 🗄️ Firebase Firestore Structure

## Collection Structure Overview

```
firestore/
├── restaurants/          # ร้านอาหารทั้งหมด
│   ├── {restaurantId}
│   │   ├── menus/       # เมนูของแต่ละร้าน (subcollection)
│   │   │   └── {menuId}
│   │
├── orders/              # คำสั่งซื้อทั้งหมด
│   └── {orderId}
│
├── users/               # ข้อมูลผู้ใช้
│   └── {userId}
│
├── categories/          # หมวดหมู่อาหาร (optional)
│   └── {categoryId}
│
└── reviews/             # รีวิวร้านอาหาร (optional - future)
    └── {reviewId}
```

---

## 📋 Detailed Collection Schemas

### 1. **restaurants** Collection

```javascript
{
  // Document ID: auto-generated
  
  // Basic Info
  "name": "ร้านส้มตำนัวแท้",
  "description": "ส้มตำและอาหารอีสานต้นตำรับ",
  "image": "https://example.com/restaurant-image.jpg",
  "coverImage": "https://example.com/restaurant-cover.jpg",
  
  // Category
  "category": "thai", // "thai", "japanese", "western", "chinese", "cafe"
  "tags": ["อาหารอีสาน", "ส้มตำ", "ลาบ"], // optional
  
  // Ratings & Stats
  "rating": 4.8,
  "totalReviews": 150,
  "totalOrders": 500,
  
  // Delivery Info
  "deliveryTime": "20-30 min",
  "deliveryFee": 15,
  "minimumOrder": 50,
  
  // Status
  "isOpen": true,
  "isFeatured": false,
  "isActive": true,
  
  // Location
  "address": "123 ถนนสุขุมวิท กรุงเทพฯ",
  "latitude": 13.7563,    // optional
  "longitude": 100.5018,  // optional
  
  // Timestamps
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### 2. **restaurants/{restaurantId}/menus** Subcollection

```javascript
{
  // Document ID: auto-generated
  
  // Basic Info
  "name": "ส้มตำไทย",
  "description": "ส้มตำรสชาติเด็ด ปรุงสดใหม่ทุกวัน",
  "image": "https://example.com/menu-image.jpg",
  
  // Pricing
  "price": 45,
  "originalPrice": 50, // optional - for showing discount
  "discount": 10,      // optional - percentage
  
  // Category
  "category": "main", // "main", "appetizer", "dessert", "drink", "side"
  
  // Status & Flags
  "isAvailable": true,
  "isPopular": true,
  "isRecommended": false,
  
  // Additional Info
  "spicyLevel": 3,     // optional - 0-5
  "preparationTime": "10-15 min", // optional
  "calories": 250,     // optional
  
  // Options (for future feature)
  "options": [         // optional
    {
      "name": "ระดับความเผ็ด",
      "choices": ["ไม่เผ็ด", "เผ็ดน้อย", "เผ็ดมาก"],
      "required": true
    }
  ],
  
  // Stats
  "orderCount": 100,   // optional
  
  // Timestamps
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### 3. **orders** Collection

```javascript
{
  // Document ID: auto-generated
  
  // User Info
  "userId": "user-uid-123",
  "userEmail": "user@example.com",
  
  // Restaurant Info
  "restaurantId": "restaurant-id-123",
  "restaurantName": "ร้านส้มตำนัวแท้",
  "restaurantImage": "https://example.com/restaurant-image.jpg",
  
  // Order Items
  "items": [
    {
      "menuId": "menu-id-123",
      "name": "ส้มตำไทย",
      "price": 45,
      "quantity": 2,
      "image": "https://example.com/menu-image.jpg",
      "note": "ไม่เผ็ด"  // optional
    },
    {
      "menuId": "menu-id-456",
      "name": "ลาบหมู",
      "price": 55,
      "quantity": 1,
      "image": "https://example.com/menu-image2.jpg"
    }
  ],
  
  // Pricing
  "subtotal": 145,        // sum of all items
  "deliveryFee": 15,
  "discount": 0,          // optional
  "totalPrice": 160,
  
  // Status
  "status": "pending",    // "pending", "confirmed", "preparing", "delivering", "completed", "cancelled"
  "statusHistory": [      // optional - track status changes
    {
      "status": "pending",
      "timestamp": Timestamp,
      "note": "รอการยืนยัน"
    }
  ],
  
  // Delivery Info
  "deliveryAddress": {
    "name": "บ้าน",
    "phone": "0812345678",
    "address": "123/45 ถนนสุขุมวิท แขวง... เขต... กรุงเทพฯ 10110",
    "note": "ตึกสีฟ้า ชั้น 3"
  },
  
  // Payment Info (for future)
  "paymentMethod": "cash", // "cash", "card", "promptpay"
  "paymentStatus": "pending", // "pending", "paid", "failed"
  
  // Timestamps
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "estimatedDeliveryTime": Timestamp, // optional
  "completedAt": Timestamp            // optional
}
```

### 4. **users/{userId}** Collection

```javascript
{
  // Document ID: userId from Firebase Auth
  
  // Basic Info
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/avatar.jpg",
  "phone": "0812345678",
  
  // Addresses
  "addresses": [
    {
      "id": "addr-1",
      "name": "บ้าน",
      "address": "123/45 ถนนสุขุมวิท...",
      "phone": "0812345678",
      "note": "ตึกสีฟ้า",
      "isDefault": true,
      "latitude": 13.7563,  // optional
      "longitude": 100.5018 // optional
    },
    {
      "id": "addr-2",
      "name": "ที่ทำงาน",
      "address": "456 ถนนพระราม 4...",
      "phone": "0812345678",
      "note": "อาคาร A ชั้น 5",
      "isDefault": false
    }
  ],
  
  // Preferences
  "favoriteRestaurants": ["restaurant-id-1", "restaurant-id-2"],
  "defaultPaymentMethod": "cash", // optional
  
  // Stats
  "totalOrders": 25,
  "totalSpent": 5000,
  
  // Timestamps
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "lastOrderAt": Timestamp
}
```

### 5. **categories** Collection (Optional)

```javascript
{
  // Document ID: category code (e.g., "thai", "japanese")
  
  "id": "thai",
  "name": "อาหารไทย",
  "nameEn": "Thai Food",
  "icon": "🌶️",
  "image": "https://example.com/category-thai.jpg",
  "description": "อาหารไทยต้นตำรับ รสชาติเข้มข้น",
  "order": 1,              // for sorting
  "isActive": true,
  "restaurantCount": 15,   // number of restaurants in this category
  "createdAt": Timestamp
}
```

### 6. **reviews** Collection (Optional - Future Feature)

```javascript
{
  // Document ID: auto-generated
  
  "userId": "user-uid-123",
  "userName": "John Doe",
  "userPhoto": "https://example.com/avatar.jpg",
  
  "restaurantId": "restaurant-id-123",
  "orderId": "order-id-123",
  
  "rating": 5,           // 1-5
  "comment": "อร่อยมากครับ บริการดีมาก",
  "images": [            // optional
    "https://example.com/review-photo1.jpg",
    "https://example.com/review-photo2.jpg"
  ],
  
  "likes": 0,            // optional
  "isVerified": true,    // verified purchase
  
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## 🔐 Security Rules

ดูรายละเอียดใน `firestore.rules`

### Key Points:
- ✅ **restaurants** - ทุกคนอ่านได้, เฉพาะ authenticated เขียนได้
- ✅ **orders** - แต่ละคนอ่านได้เฉพาะของตัวเอง
- ✅ **users** - แต่ละคนจัดการได้เฉพาะของตัวเอง
- ✅ **reviews** - ทุกคนอ่านได้, เฉพาะผู้เขียนแก้ไขได้

---

## 📊 Indexes Required

สร้าง indexes เหล่านี้ใน Firebase Console:

### restaurants
```
Collection: restaurants
Fields: category (Ascending), rating (Descending)
```

### orders
```
Collection: orders
Fields: userId (Ascending), createdAt (Descending)
```

```
Collection: orders
Fields: userId (Ascending), status (Ascending), createdAt (Descending)
```

### reviews (optional)
```
Collection: reviews
Fields: restaurantId (Ascending), createdAt (Descending)
```

---

## 🚀 How to Apply

### 1. Deploy Firestore Rules:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 2. Create Indexes:
- Go to Firebase Console
- Firestore Database → Indexes
- Create composite indexes as listed above
- Or wait for error messages when querying, Firebase will provide index creation links

### 3. Seed Sample Data:
```typescript
// In your app
import { seedDatabase } from './scripts/seedData';
await seedDatabase();
```

---

## 💡 Tips

### Query Examples:

```typescript
// Get all restaurants in a category
const restaurantsRef = collection(db, 'restaurants');
const q = query(
  restaurantsRef, 
  where('category', '==', 'thai'),
  orderBy('rating', 'desc')
);

// Get user's orders
const ordersRef = collection(db, 'orders');
const q = query(
  ordersRef,
  where('userId', '==', currentUser.uid),
  orderBy('createdAt', 'desc')
);

// Get popular menus
const menusRef = collection(db, 'restaurants', restaurantId, 'menus');
const q = query(
  menusRef,
  where('isPopular', '==', true),
  where('isAvailable', '==', true)
);
```

### Best Practices:
1. **Use timestamps** - Always track createdAt and updatedAt
2. **Denormalize when needed** - Store restaurantName in orders for quick access
3. **Use subcollections** - Keep menus as subcollection of restaurants
4. **Index strategically** - Only create indexes you actually use
5. **Validate on client** - Check data before writing to Firestore
