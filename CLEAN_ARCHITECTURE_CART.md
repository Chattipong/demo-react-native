# 🏗️ Clean Architecture Refactoring - Cart System

## ✅ สิ่งที่เสร็จสมบูรณ์

### 1. **Single Restaurant Validation** ✅
- ตรวจสอบว่าสามารถสั่งอาหารได้จากร้านเดียวต่อครั้ง
- แสดง Alert ถามผู้ใช้ว่าต้องการเปลี่ยนร้านหรือไม่
- ล้างตะกร้าอัตโนมัติเมื่อเปลี่ยนร้าน

### 2. **Toast Notifications** ✅
- แทนที่ Alert ที่รบกวนด้วย Toast (react-native-root-toast)
- แสดง Toast เมื่อ: เพิ่มสินค้า, ลบสินค้า, เกิด error
- สีเขียว (#34C759) สำหรับ success, สีแดง (#FF3B30) สำหรับ error

### 3. **Persistent Storage** ✅
- บันทึกตะกร้าใน AsyncStorage
- โหลดตะกร้าอัตโนมัติเมื่อเปิดแอพ
- ตะกร้าไม่หายเมื่อปิดแอพ

### 4. **Delivery Fee Calculation** ✅
- แสดงค่าจัดส่งในหน้าตะกร้า
- คำนวณยอดรวมถูกต้อง (ค่าอาหาร + ค่าจัดส่ง)
- แสดงชื่อร้านในตะกร้า

---

## 📐 Clean Architecture Structure

```
lib/
├── domain/              # ⭐ Business Logic Layer
│   ├── entities/        
│   │   └── Cart.ts      # Cart Entity with business rules
│   ├── usecases/        
│   │   └── CartUseCases.ts  # Cart operations (add, remove, update, clear)
│   └── repositories/    
│       └── ICartRepository.ts  # Repository interface
│
├── data/                # 📦 Data Layer  
│   ├── repositories/    
│   │   └── CartRepository.ts  # Concrete implementation
│   └── datasources/     
│       └── LocalCartDataSource.ts  # AsyncStorage operations
│
└── presentation/        # 🎨 Presentation Layer
    └── state/           
        └── CartProvider.tsx  # React Context with Clean Architecture
```

---

## 🔑 Key Components

### 1. Domain Layer (lib/domain/)

#### **Cart.ts** - Entity
```typescript
export class Cart {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
  deliveryFee: number
  
  // Business Rules
  canAddItem(restaurantId: string): boolean
  getItemQuantity(menuId: string): number
  
  // Computed Properties
  get itemCount(): number
  get subtotal(): number
  get total(): number
  get cartItems(): CartItem[]
  get restaurantInfo(): Restaurant | null
}
```

#### **CartUseCases.ts** - Use Cases
```typescript
export class CartUseCases {
  addToCart(params): Promise<{success, cart, error?}>
  updateQuantity(itemId, quantity): Promise<{success, cart}>
  removeItem(itemId): Promise<{success, cart}>
  clearCart(): Promise<{success, cart}>
  getCart(): Promise<Cart>
}
```

### 2. Data Layer (lib/data/)

#### **LocalCartDataSource.ts**
- บันทึก/อ่าน Cart จาก AsyncStorage
- Key: `@food_delivery_cart`
- Serialize Cart entity เป็น JSON

#### **CartRepository.ts**
- Implements `ICartRepository`
- Bridge ระหว่าง Domain และ Data Source

### 3. Presentation Layer (lib/presentation/)

#### **CartProvider.tsx**
- React Context for state management
- Dependency Injection: `CartUseCases`, `CartRepository`, `LocalCartDataSource`
- Toast notifications
- Alert confirmations
- Error handling

---

## 🎯 เปรียบเทียบ: Before vs After

### Before (Context-based)
```typescript
// contexts/CartContext.tsx
const [cartItems, setCartItems] = useState([])
// ❌ Business logic mixed with UI state
// ❌ No persistence
// ❌ No restaurant validation
// ❌ Alert notifications (intrusive)
```

### After (Clean Architecture)
```typescript
// lib/presentation/state/CartProvider.tsx  
const [cart, setCart] = useState<Cart>(new Cart())
// ✅ Business logic in Domain layer
// ✅ Persistent storage via Repository
// ✅ Single restaurant validation
// ✅ Toast notifications (non-intrusive)
```

---

## 📱 การใช้งาน

### ใน Component
```typescript
import { useCart } from '@/lib/presentation/state/CartProvider'

function RestaurantDetail() {
  const { addToCart, getItemQuantity } = useCart()
  
  const handleAdd = () => {
    addToCart(
      menuItem,
      restaurant.id,
      restaurant.name,
      restaurant.deliveryFee,  // ✨ New: delivery fee
      1
    )
  }
  
  const quantity = getItemQuantity(menuItem.id)
  // Shows quantity from cart
}
```

### ใน App Root
```typescript
// app/_layout.tsx
import { CartProvider } from '@/lib/presentation/state/CartProvider'

<RootSiblingParent>  {/* For Toast */}
  <CartProvider>
    {/* Your app */}
  </CartProvider>
</RootSiblingParent>
```

---

## 🧪 Testing Benefits

### ✅ Testable Layers
```typescript
// Domain Layer - Pure functions, easy to test
const cart = new Cart()
cart.addItem(...)  // No dependencies!

// Use Cases - Business logic testing
const useCase = new CartUseCases(mockRepo)
await useCase.addToCart(...)

// Repository - Data logic testing
const repo = new CartRepository(mockDataSource)
await repo.saveCart(cart)
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.x",
    "react-native-root-toast": "^3.x"
  }
}
```

---

## 🚀 สิ่งที่ต้องทำต่อ

1. **ลบไฟล์เก่า** (deprecated):
   - `contexts/CartContext.tsx` ❌
   - `lib/presentation/state/CartContext.tsx` ❌
   - `lib/data/services/NotificationService.ts` ❌

2. **เพิ่ม Unit Tests**:
   - `Cart.test.ts` - Test business rules
   - `CartUseCases.test.ts` - Test use cases
   - `CartRepository.test.ts` - Test data operations

3. **เพิ่ม Features**:
   - Checkout flow (Todo #6)
   - Order History (Todo #7)
   - Order Tracking (Todo #8)

---

## 🎉 สรุป

เราได้ refactor Cart system ให้เป็น Clean Architecture สมบูรณ์แล้ว พร้อมทั้ง 4 features:

1. ✅ **Single Restaurant Validation** - ป้องกันสั่งจากหลายร้าน
2. ✅ **Toast Notifications** - UX ที่ดีขึ้น, ไม่รบกวน
3. ✅ **Persistent Storage** - บันทึกตะกร้าอัตโนมัติ
4. ✅ **Delivery Fee** - แสดงและคำนวณค่าจัดส่งถูกต้อง

**ข้อดี:**
- 🧪 Testable - แต่ละ layer ทดสอบได้อิสระ
- 🔄 Maintainable - แยก concerns ชัดเจน
- 🚀 Scalable - เพิ่ม feature ง่าย
- 📱 Persistent - ตะกร้าไม่หายเมื่อปิดแอพ
- 😊 Better UX - Toast แทน Alert
