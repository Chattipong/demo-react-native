# 🔧 วิธีแก้ Redirect URI สำหรับ Local Development

## ✅ ขั้นตอนง่ายที่สุด:

### 1. เพิ่ม Redirect URI ใน Google Cloud Console

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. เลือกโปรเจ็กต์ที่ใช้กับ Firebase  
3. **APIs & Services** → **Credentials**
4. คลิกที่ **Web Client ID** ของคุณ
5. ในส่วน **Authorized redirect URIs** เพิ่ม:

```
http://localhost:19006
http://127.0.0.1:19006
```

### 2. Save และทดสอบ

1. กด **Save** ใน Google Cloud Console
2. รีสตาร์ท Metro bundler:
   ```bash
   npm start -- --reset-cache
   ```
3. ทดสอบ Google Sign-In ใหม่

## 🎯 Alternative URLs หากยังไม่ได้:

ลองเพิ่ม redirect URIs เหล่านี้:

```
http://localhost:19006
http://127.0.0.1:19006  
http://localhost:8081
http://127.0.0.1:8081
https://localhost:19006
```

## � วิธีการทดสอบ:

1. **รันแอป:** `npm start`
2. **เปิด Web:** กด `w` ใน terminal เพื่อเปิด web browser
3. **ทดสอบ Google Sign-In:** ควรทำงานได้ใน browser

## 🔍 หากยังไม่ได้:

ลองใช้ Custom redirect URI:

```typescript
const redirectUri = "http://localhost:19006/auth/callback";
```

แล้วเพิ่มใน Google Console:
```
http://localhost:19006/auth/callback
```
