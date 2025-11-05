import { Alert } from "react-native";

// Fallback สำหรับ Expo Go
export const configureGoogleSignIn = (): void => {
  console.log("⚠️ Google Sign-In ไม่สามารถใช้งานใน Expo Go ได้");
  console.log("📋 ใช้ development build แทน: npx expo run:ios");
};

export const signInWithGoogle = async (): Promise<void> => {
  Alert.alert(
    "Google Sign-In ไม่พร้อมใช้งาน",
    "Google Sign-In ต้องการ native module ซึ่งไม่สามารถทำงานใน Expo Go ได้\n\nวิธีแก้:\n1. ใช้ Development Build: npx expo run:ios\n2. หรือทดสอบด้วย Email/Password ก่อน",
    [
      { text: "ตกลง", style: "default" },
      {
        text: "วิธีการแก้ไข",
        onPress: () => {
          console.log("🔧 วิธีแก้ปัญหา:");
          console.log("1. หยุด Expo Go");
          console.log("2. รัน: npx expo run:ios");
          console.log("3. หรือรัน: npx expo run:android");
          console.log("4. ทดสอบ Google Sign-In ใน development build");
        },
      },
    ]
  );
};

export const signOutGoogle = async (): Promise<void> => {
  console.log("⚠️ Google Sign-Out ไม่สามารถใช้งานใน Expo Go ได้");
};
