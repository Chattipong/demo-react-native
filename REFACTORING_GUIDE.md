# Project Structure Refactoring

โปรเจคนี้ได้ถูก refactor ให้เป็นไปตาม React best practices และมีการแยก concerns อย่างชัดเจน

## 📁 โครงสร้าง Folder ใหม่

```
├── app/
│   └── (main)/
│       └── index.tsx                 # Main screen (simplified)
├── components/
│   ├── home/                         # Home-specific components
│   │   ├── UserInfoSection.tsx       # User information and action buttons
│   │   ├── CameraSection.tsx         # Camera and image picker functionality
│   │   ├── InstructionSteps.tsx      # Instruction steps component
│   │   └── index.ts                  # Barrel export
│   └── ... (existing components)
├── hooks/                            # Custom hooks
│   ├── useAuth.ts                    # Authentication hook
│   ├── useNotifications.ts           # Notifications hook
│   ├── useCamera.ts                  # Camera and image picker hook
│   └── index.ts                      # Barrel export
├── lib/                              # Library utilities
│   ├── services/                     # Business logic services
│   │   ├── authService.ts            # Authentication service
│   │   ├── notificationService.ts    # Notification service
│   │   ├── cameraService.ts          # Camera and image picker service
│   │   └── index.ts                  # Service exports
│   ├── utils/                        # Utility functions
│   └── index.ts                      # Barrel export
```

## 🔧 Services

### Authentication Service (`lib/services/authService.ts`)
- `handleLogout()` - ออกจากระบบ
- `showLogoutConfirmation()` - แสดง confirmation dialog
- `getCurrentUser()` - ดึงข้อมูลผู้ใช้ปัจจุบัน
- `isUserLoggedIn()` - ตรวจสอบสถานะการล็อกอิน
- `isEmailVerified()` - ตรวจสอบการยืนยันอีเมล

### Camera Service (`lib/services/cameraService.ts`)
- `requestCameraPermissions()` - ขออนุญาตใช้กล้อง
- `openCamera()` - เปิดกล้องถ่ายรูป
- `openImagePicker()` - เปิด gallery เลือกรูป
- `showImagePickerOptions()` - แสดง action sheet เลือกระหว่างกล้องหรือ gallery

### Notification Service (`lib/services/notificationService.ts`)
- `setupNotificationHandler()` - ตั้งค่า notification handler
- `requestNotificationPermissions()` - ขออนุญาตการแจ้งเตือน
- `sendImmediateNotification()` - ส่งการแจ้งเตือนทันที
- `scheduleNotification()` - ตั้งเวลาการแจ้งเตือน
- `cancelAllNotifications()` - ยกเลิกการแจ้งเตือนทั้งหมด
- `cancelNotification()` - ยกเลิกการแจ้งเตือนตาม ID

## 🎣 Custom Hooks

### useAuth Hook (`hooks/useAuth.ts`)
```tsx
const { user, isLoading, isEmailVerified, handleQuickLogout, refreshUser } = useAuth();
```

### useCamera Hook (`hooks/useCamera.ts`)
```tsx
const { selectedImage, isLoading, takePhoto, pickImage, showImageOptions, clearImage } = useCamera();
```

### useNotifications Hook (`hooks/useNotifications.ts`)
```tsx
const { isInitialized, testPushNotification, testScheduledNotification } = useNotifications();
```

## 🧩 Components

### CameraSection (`components/home/CameraSection.tsx`)
Component สำหรับการจัดการรูปภาพ (ถ่ายรูป/เลือกรูป)

**Props:**
- `selectedImage: string | null`
- `isLoading: boolean`
- `onTakePhoto: () => void`
- `onPickImage: () => void`
- `onShowOptions: () => void`
- `onClearImage: () => void`

### UserInfoSection (`components/home/UserInfoSection.tsx`)
Component สำหรับแสดงข้อมูลผู้ใช้และปุ่มต่างๆ

**Props:**
- `userEmail?: string`
- `isEmailVerified: boolean`
- `onLogout: () => void`
- `onTestNotification: () => void`
- `onScheduledNotification: () => void`

### InstructionSteps (`components/home/InstructionSteps.tsx`)
Component สำหรับแสดงขั้นตอนการใช้งาน

## 🎯 ประโยชน์ของการ Refactor

### 1. **Separation of Concerns**
- Business logic แยกออกจาก UI components
- Services จัดการ Firebase และ Notifications
- Hooks จัดการ state และ lifecycle

### 2. **Reusability**
- Services สามารถใช้ในหลาย components
- Hooks สามารถใช้ในหลาย screens
- Components แยกเป็นชิ้นเล็กๆ ใช้ซ้ำได้

### 3. **Testability**
- แต่ละ service และ hook ทำงานอิสระกัน
- ง่ายต่อการเขียน unit tests
- Mock dependencies ได้ง่าย

### 4. **Maintainability**
- โค้ดอ่านง่าย เข้าใจง่าย
- แก้ไขง่าย เมื่อต้องการเปลี่ยนแปลง
- เพิ่มฟีเจอร์ใหม่ได้ง่าย

### 5. **Type Safety**
- TypeScript interfaces ชัดเจน
- Props type checking
- Service return types

## 🚀 การใช้งาน

### Import Services
```tsx
import { handleLogout, sendImmediateNotification } from '@/lib/services';
```

### Import Hooks
```tsx
import { useAuth, useNotifications } from '@/hooks';
```

### Import Components
```tsx
import { UserInfoSection, InstructionSteps } from '@/components/home';
```

## 💡 ตัวอย่างการขยายฟีเจอร์

### เพิ่ม Service ใหม่
```tsx
// lib/services/userProfileService.ts
export const updateUserProfile = async (data: UserProfile) => {
  // implementation
};
```

### เพิ่ม Hook ใหม่
```tsx
// hooks/useUserProfile.ts
export const useUserProfile = () => {
  // implementation
};
```

### เพิ่ม Component ใหม่
```tsx
// components/home/ProfileSection.tsx
export const ProfileSection: React.FC<Props> = ({ ... }) => {
  // implementation
};
```

---

**หมายเหตุ:** โครงสร้างนี้เป็นไปตาม React และ React Native best practices เพื่อให้โค้ดมีความยืดหยุ่น ง่ายต่อการดูแลรักษา และสามารถขยายได้ในอนาคต
