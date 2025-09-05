# 🧪 Firebase Test Suite

ไฟล์ทดสอบต่างๆ สำหรับ Firebase Authentication และ Configuration

## 📁 ไฟล์ทดสอบ

### 1. `firebase-connection.test.js`
ทดสอบการเชื่อมต่อ Firebase และความถูกต้องของ API Key

```bash
node test/firebase-connection.test.js
```

### 2. `firebase-auth.test.js`
ทดสอบ Authentication (การสร้างบัญชีและเข้าสู่ระบบ)

```bash
# ทดสอบอย่างง่าย (user1@sample.com)
node test/firebase-auth.test.js

# ทดสอบครบทุกผู้ใช้
node test/firebase-auth.test.js --full
```

### 3. `firebase-esmodule.test.js`
ทดสอบ Firebase ด้วย ES Module syntax (สำหรับ environment ที่รองรับ)

```bash
node test/firebase-esmodule.test.js
```

## 🎯 ผลการทดสอบที่คาดหวัง

### ✅ การทดสอบสำเร็จ:
- Firebase initialized successfully
- Auth object created
- API Key is valid
- Login successful

### ❌ ข้อผิดพลาดที่เป็นไปได้:
- `auth/api-key-not-valid` - API Key ไม่ถูกต้อง
- `auth/user-not-found` - ไม่พบผู้ใช้
- `auth/wrong-password` - รหัสผ่านผิด
- `auth/email-already-in-use` - อีเมลถูกใช้แล้ว

## 🔧 การแก้ไขปัญหา

1. **เช็ค Firebase Console** - ตรวจสอบ project status
2. **ตรวจสอบ API Key** - อัปเดต firebaseConfig.ts หากจำเป็น
3. **เช็ค Authentication Settings** - เปิดใช้งาน Email/Password provider
4. **Network connectivity** - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต

## 📊 Test Users

ผู้ใช้สำหรับทดสอบ:
- `user1@sample.com` / `123456`
- `test@example.com` / `password123`
