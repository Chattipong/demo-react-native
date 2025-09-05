// ไฟล์สำหรับทดสอบการเชื่อมต่อ Firebase API Key
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// ดึง config จากไฟล์หลัก
const firebaseConfig = {
  apiKey: "AIzaSyB-m5uGxbtAewwlsppGe5pR8RaMWgLfmQ0",
  authDomain: "customer-18261.firebaseapp.com",
  projectId: "customer-18261",
  storageBucket: "customer-18261.appspot.com",
  messagingSenderId: "45618685713",
  appId: "1:45618685713:web:a65a67332675cee5caceb0",
};

console.log("🔥 กำลังทดสอบ Firebase API Key...");
console.log("📊 Project ID:", firebaseConfig.projectId);
console.log("🔑 API Key (ตัวแรก 20 ตัว):", firebaseConfig.apiKey.substring(0, 20) + "...");

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log("✅ Firebase initialized successfully!");
  console.log("✅ Auth object created:", !!auth);
  console.log("✅ API Key is valid!");
  console.log("📱 Ready for authentication operations");
} catch (error) {
  console.error("❌ Firebase initialization error:", error.message);
  console.error("❌ API Key may be invalid or project may have issues");
  process.exit(1);
}
