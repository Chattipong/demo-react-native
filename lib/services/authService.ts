import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../../firebaseConfig";
import { signOutGoogle } from "./googleAuthService";

// ออกจากระบบ
export const handleLogout = async (): Promise<void> => {
  try {
    // Sign out จาก Google ก่อน (ถ้ามี)
    await signOutGoogle();

    // แล้วค่อย sign out จาก Firebase
    await signOut(auth);
    router.replace("/(auth)/login");
  } catch (error: any) {
    console.error("Logout error:", error);
    Alert.alert("ข้อผิดพลาด", "ไม่สามารถออกจากระบบได้");
  }
};

// แสดง confirmation dialog สำหรับออกจากระบบ
export const showLogoutConfirmation = (): void => {
  Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบหรือไม่?", [
    { text: "ยกเลิก", style: "cancel" },
    {
      text: "ออกจากระบบ",
      style: "destructive",
      onPress: handleLogout,
    },
  ]);
};

// ดึงข้อมูลผู้ใช้ปัจจุบัน
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ตรวจสอบสถานะการล็อกอิน
export const isUserLoggedIn = (): boolean => {
  return !!auth.currentUser;
};

// ตรวจสอบการยืนยันอีเมล
export const isEmailVerified = (): boolean => {
  return auth.currentUser?.emailVerified || false;
};
