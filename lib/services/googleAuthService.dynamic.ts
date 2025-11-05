// ตัวช่วยสำหรับตรวจสอบว่าอยู่ใน Development Build หรือ Expo Go
// Google Sign-In ทำงานได้เฉพาะใน Development Build เท่านั้น

let isGoogleSigninAvailable = false;

try {
  // ลองใช้ GoogleSignin ดู
  const { GoogleSignin } = require("@react-native-google-signin/google-signin");
  isGoogleSigninAvailable = !!GoogleSignin;
} catch (error) {
  console.log("⚠️  Google Sign-In ไม่พร้อมใช้งาน - อาจอยู่ใน Expo Go");
  isGoogleSigninAvailable = false;
}

// Export บอกสถานะ
export { isGoogleSigninAvailable };
