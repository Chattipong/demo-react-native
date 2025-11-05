# การตั้งค่า Google Sign-In ด้วย @react-native-google-signin/google-signin

## 🎯 ข้อดีของ react-native-google-signin:
✅ **เสถียร** - ใช้งานได้จริงใน production  
✅ **ง่าย** - การตั้งค่าไม่ซับซ้อน  
✅ **รองรับครบ** - ทั้ง iOS, Android และ Expo  
✅ **อัปเดตสม่ำเสมอ** - community ใช้มาก  

---

## ขั้นตอนการตั้งค่าใน Firebase Console

### 1. เปิดใช้งาน Google Authentication
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจ็กต์ของคุณ
3. ไปที่ **Authentication** > **Sign-in method**
4. คลิกที่ **Google** และเปิดใช้งาน
5. ใส่ชื่อโปรเจ็กต์และอีเมล support

### 2. หา Web Client ID
1. ไปที่ **Project Settings** > **General**
2. ในส่วน **Your apps** จะเห็น **Web Client ID**  
3. คัดลอก **Client ID เต็ม** (รวม .apps.googleusercontent.com)

**ตัวอย่าง:**
```
208504381449-bfr0dbqjhpk6i2l64knek1r61kq0bp8o.apps.googleusercontent.com
```

### 3. อัปเดต googleAuthService.ts
ใส่ Web Client ID ในไฟล์ `lib/services/googleAuthService.ts`:

```typescript
webClientId: '208504381449-bfr0dbqjhpk6i2l64knek1r61kq0bp8o.apps.googleusercontent.com', // ใส่ Client ID เต็ม
```

### 4. สำหรับ Development Build
หากใช้ Expo development build ต้องเพิ่มใน `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

### 5. ทดสอบ
1. รีสตาร์ท Metro bundler: `npm start -- --reset-cache`
2. ทดสอบใน **อุปกรณ์จริง** หรือ **simulator** (ไม่ใช่ Expo Go)
3. สำหรับ Expo Go ต้องใช้ `npx expo run:ios` หรือ `npx expo run:android`

---

## 🚀 การ Build และทดสอบ

### สำหรับ Development Build:
```bash
# iOS
npx expo run:ios

# Android  
npx expo run:android
```

### สำหรับ Expo Go (ไม่แนะนำ):
- Google Sign-In ไม่ทำงานใน Expo Go
- ต้องใช้ development build

---

## ⚙️ ตั้งค่าเพิ่มเติม

### สำหรับ Android:
1. **เพิ่ม SHA-1 fingerprint** ใน Firebase Console:
```bash
# Debug
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### สำหรับ iOS:
1. **เพิ่ม Bundle ID** ใน Firebase Console  
2. **ดาวน์โหลด GoogleService-Info.plist** และใส่ในโปรเจ็กต์

---

## 🐛 การแก้ปัญหา

### � แก้ปัญหา: Invalid Idp Response

**Error:** `Firebase: Invalid Idp Response: the Google id_token is not allowed to be used with this application`

**สาเหตุ:** Web Client ID ไม่ตรงกับ Firebase Project

**วิธีแก้:**

#### 1. หา Web Client ID ที่ถูกต้อง:
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจ็กต์: **customer-18261** (project number: 45618685713)
3. ไปที่ **Authentication** → **Sign-in method** 
4. คลิก **Google** 
5. ดู **Web SDK configuration** จะมี Web Client ID ที่ถูกต้อง

#### 2. หรือไปที่ Project Settings:
1. **Project Settings** → **General**
2. ในส่วน **Your apps** ดู Web Client ID
3. **ต้องเป็น project เดียวกับ project number: 45618685713**

#### 3. อัปเดต Client ID ใน googleAuthService.ts:
```typescript
webClientId: "YOUR_CORRECT_WEB_CLIENT_ID_HERE.apps.googleusercontent.com",
iosClientId: "YOUR_CORRECT_WEB_CLIENT_ID_HERE.apps.googleusercontent.com",
```

#### 4. อัปเดต app.json:
```json
"iosUrlScheme": "com.googleusercontent.apps.YOUR_CORRECT_CLIENT_ID_HERE"
```

### 🛡️ แก้ปัญหา Privacy Permissions (iOS)

**Error:** `NSPhotoLibraryUsageDescription key missing`

**วิธีแก้:**
1. ✅ **เพิ่ม Privacy Descriptions** ใน `app.json`:
```json
"ios": {
  "infoPlist": {
    "NSPhotoLibraryUsageDescription": "แอปนี้ต้องการเข้าถึงรูปภาพเพื่อให้คุณสามารถเลือกรูปโปรไฟล์หรือแชร์รูปภาพได้",
    "NSCameraUsageDescription": "แอปนี้ต้องการเข้าถึงกล้องเพื่อให้คุณสามารถถ่ายรูปและแชร์รูปภาพได้",
    "NSMicrophoneUsageDescription": "แอปนี้ต้องการเข้าถึงไมโครโฟนสำหรับการบันทึกเสียงและการโทร"
  }
}
```

2. ✅ **แก้ notification warning** - เปลี่ยนจาก `shouldShowAlert` เป็น `shouldShowBanner` และ `shouldShowList`

3. **Rebuild development build:**
```bash
npx expo run:ios --clear
```

**⚠️ หมายเหตุ:** หลังจากเพิ่ม privacy descriptions แล้ว ต้อง rebuild เพื่อให้การเปลี่ยนแปลงมีผล

### หาก Google Sign-In ไม่ทำงาน:

1. **ตรวจสอบ Client ID:**
   - ต้องเป็น Web Client ID
   - ต้องรวม `.apps.googleusercontent.com`

2. **ตรวจสอบ SHA-1 (Android):**
   - เพิ่มใน Firebase Console
   - ทั้ง debug และ release

3. **ตรวจสอบ Bundle ID (iOS):**
   - ต้องตรงกับใน Firebase Console

4. **ใช้ Development Build:**
   ```bash
   npx expo install expo-dev-client
   npx expo run:ios # หรือ run:android
   ```

### Console Logs ที่ควรเห็น:

**ใน Expo Go:**
```
⚠️ Google Sign-In ไม่พร้อมใช้งาน - ใช้ fallback
Google Sign-In configuration skipped (Expo Go)
```

**ใน Development Build:**
```
🔍 เริ่มต้น Google Sign-In...
📱 Google User Info: {...}
✅ Google Sign-In สำเร็จ! user@example.com
```

---

## ✅ Checklist:

- [ ] ✅ ติดตั้ง `@react-native-google-signin/google-signin`
- [ ] ✅ เปิดใช้งาน Google Auth ใน Firebase
- [ ] ✅ ใส่ Web Client ID ใน googleAuthService.ts
- [ ] ✅ เพิ่ม plugin ใน app.json
- [ ] ✅ Build development build (`npx expo run:ios/android`)
- [ ] ✅ ทดสอบในอุปกรณ์จริง

**Google Sign-In พร้อมใช้งาน!** 🎉
