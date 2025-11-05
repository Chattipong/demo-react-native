import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { router } from "expo-router";
import { Alert } from "react-native";
import { auth } from "../../firebaseConfig";

// ตั้งค่า Google Sign-In
export const configureGoogleSignIn = (): void => {
  GoogleSignin.configure({
    // ใช้ Web Client ID จาก Firebase Console
    webClientId:
      "208504381449-bfr0dbqjhpk6i2l64knek1r61kq0bp8o.apps.googleusercontent.com",
    // ใช้ iOS Client ID เดียวกัน (สำหรับกรณีที่ไม่มี GoogleService-Info.plist)
    iosClientId:
      "208504381449-bfr0dbqjhpk6i2l64knek1r61kq0bp8o.apps.googleusercontent.com",
    offlineAccess: true,
    hostedDomain: "", // สำหรับ G Suite (ถ้าไม่ใช้ให้เป็น string ว่าง)
    forceCodeForRefreshToken: true, // สำหรับ Android
  });
};

// ฟังก์ชัน Google Sign-In
export const signInWithGoogle = async (): Promise<void> => {
  try {
    console.log("� เริ่มต้น Google Sign-In...");

    // เช็คว่า Google Play Services พร้อมใช้งานมั้ย
    await GoogleSignin.hasPlayServices();

    // Sign in ด้วย Google
    const userInfo = await GoogleSignin.signIn();

    console.log("📱 Google User Info:", userInfo);

    // ตรวจสอบว่ามี ID Token มั้ย
    if (!userInfo.data?.idToken) {
      throw new Error("ไม่สามารถรับ Google ID Token ได้");
    }

    // สร้าง credential สำหรับ Firebase
    const googleCredential = GoogleAuthProvider.credential(
      userInfo.data.idToken
    );

    // Sign in ใน Firebase ด้วย Google credential
    const firebaseUserCredential = await signInWithCredential(
      auth,
      googleCredential
    );

    console.log("✅ Google Sign-In สำเร็จ!", firebaseUserCredential.user.email);

    // นำไปหน้าหลัก
    router.replace("/(main)");
  } catch (error: any) {
    console.error("❌ Google Sign-In ล้มเหลว:", error);

    // จัดการ error ต่างๆ
    if (error.code === "sign_in_cancelled") {
      // ผู้ใช้ยกเลิกการ sign in
      console.log("ผู้ใช้ยกเลิกการ sign in");
      return;
    }

    if (error.code === "in_progress") {
      Alert.alert(
        "กำลังดำเนินการ",
        "การเข้าสู่ระบบด้วย Google กำลังดำเนินการอยู่"
      );
      return;
    }

    if (error.code === "play_services_not_available") {
      Alert.alert("ข้อผิดพลาด", "Google Play Services ไม่พร้อมใช้งาน");
      return;
    }

    // Error อื่นๆ
    Alert.alert(
      "ข้อผิดพลาด",
      `ไม่สามารถเข้าสู่ระบบด้วย Google ได้\n${error.message || "ลองอีกครั้ง"}`
    );
  }
};

// ฟังก์ชัน Sign Out จาก Google
export const signOutGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log("Google Sign-Out สำเร็จ");
  } catch (error) {
    console.error("Google Sign-Out ล้มเหลว:", error);
  }
};

// เช็คสถานะการ sign in
export const getCurrentGoogleUser = async () => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo;
  } catch {
    console.log("ไม่มี Google user ที่ sign in อยู่");
    return null;
  }
};
