// ไฟล์สำหรับทดสอบ Firebase connection (ES Module syntax)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-m5uGxbtAewwlsppGe5pR8RaMWgLfmQ0",
  authDomain: "customer-18261.firebaseapp.com",
  projectId: "customer-18261",
  storageBucket: "customer-18261.appspot.com",
  messagingSenderId: "45618685713",
  appId: "1:45618685713:web:a65a67332675cee5caceb0",
};

console.log("🔥 กำลังทดสอบ Firebase ES Module...");

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log("✅ Firebase initialized with ES modules!");
  console.log("✅ Auth object:", !!auth);
} catch (error) {
  console.error("❌ Firebase ES module error:", error);
}
