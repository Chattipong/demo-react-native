# 📱 React Native App Structure

โครงสร้างแอพใหม่ที่แยกระหว่าง Authentication และ Main Application

## 📁 โครงสร้างไฟล์

```
app/
├── _layout.tsx              # Root layout
├── index.tsx                # หน้าแรก (redirect ไป login)
├── +not-found.tsx           # 404 page
├── (auth)/                  # 🔐 Authentication screens
│   ├── _layout.tsx          # Auth layout (Stack)
│   ├── login.tsx            # หน้าเข้าสู่ระบบ
│   └── register.tsx         # หน้าสมัครสมาชิก
└── (main)/                  # 🏠 Main application screens
    ├── _layout.tsx          # Main layout (Tabs)
    ├── index.tsx            # หน้าหลัก
    └── explore.tsx          # หน้าสำรวจ
```

## 🚀 Navigation Flow

### 1. **เริ่มต้น**
- เปิดแอพ → `app/index.tsx` → Redirect ไป `(auth)/login`

### 2. **Authentication Flow**
- `(auth)/login.tsx` - หน้าเข้าสู่ระบบ
- `(auth)/register.tsx` - หน้าสมัครสมาชิก
- เมื่อ login สำเร็จ → Redirect ไป `(main)`

### 3. **Main App Flow**
- `(main)/index.tsx` - หน้าหลัก (Tab 1)
- `(main)/explore.tsx` - หน้าสำรวจ (Tab 2)

## 🔧 คุณสมบัติ

### **Auth Screens**
- ✅ เข้าสู่ระบบด้วย Firebase Authentication
- ✅ สมัครสมาชิกใหม่
- ✅ Validation และ Error handling
- ✅ ปุ่มทดสอบด่วน (user1@sample.com)

### **Main Screens**
- ✅ Tab Navigation
- ✅ หน้าหลักและหน้าสำรวจ
- ✅ UI Components พร้อมใช้งาน

## 📱 การใช้งาน

1. **เริ่มต้นแอพ**
   ```bash
   npx expo start
   ```

2. **ทดสอบ Authentication**
   - เปิดแอพ → จะไปหน้า Login อัตโนมัติ
   - กด "ทดสอบด่วน" เพื่อใส่ user1@sample.com
   - กด "เข้าสู่ระบบ" → จะไปหน้า Main App

3. **Navigation**
   - หน้า Auth: Stack navigation (login ⇄ register)
   - หน้า Main: Tab navigation (หน้าหลัก ⇄ สำรวจ)

## 🛡️ Security

- **Protected Routes**: หน้า (main) จะเข้าได้เฉพาะเมื่อ login แล้ว
- **Firebase Auth**: ใช้ Firebase Authentication
- **Clean Separation**: แยก auth flow กับ main app ชัดเจน

## 🎨 UI/UX

- **Modern Design**: UI สวยงาม responsive
- **Thai Language**: ใช้ภาษาไทย
- **Dark/Light Mode**: รองรับ theme switching
- **Loading States**: แสดงสถานะกำลังโหลด
