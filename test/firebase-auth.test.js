// ทดสอบ Firebase Authentication อย่างครอบคลุม
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyB-m5uGxbtAewwlsppGe5pR8RaMWgLfmQ0",
  authDomain: "customer-18261.firebaseapp.com",
  projectId: "customer-18261",
  storageBucket: "customer-18261.appspot.com",
  messagingSenderId: "45618685713",
  appId: "1:45618685713:web:a65a67332675cee5caceb0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ข้อมูลสำหรับทดสอบ
const testUsers = [
  { email: "user1@sample.com", password: "123456" },
  { email: "test@example.com", password: "password123" }
];

console.log("🔥 กำลังทดสอบ Firebase Authentication...");
console.log("📧 Test users:", testUsers.map(u => u.email));

// ฟังก์ชันทดสอบการสร้างบัญชีผู้ใช้
async function testCreateUser(email, password) {
  try {
    console.log(`\n📝 กำลังสร้างบัญชี: ${email}`);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ สร้างบัญชีสำเร็จ! User ID:", userCredential.user.uid);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log("⚠️ สร้างบัญชีไม่สำเร็จ:", error.code);
    if (error.code === 'auth/email-already-in-use') {
      console.log("✅ บัญชีนี้มีอยู่แล้ว - จะทดสอบการ login");
      return { success: false, reason: 'already-exists' };
    } else {
      console.error("❌ ข้อผิดพลาด:", error.message);
      return { success: false, reason: error.code, message: error.message };
    }
  }
}

// ฟังก์ชันทดสอบการเข้าสู่ระบบ
async function testLogin(email, password) {
  try {
    console.log(`\n🔐 กำลังทดสอบการเข้าสู่ระบบ: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ เข้าสู่ระบบสำเร็จ! User ID:", userCredential.user.uid);
    console.log("✅ Email verified:", userCredential.user.emailVerified);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.log("❌ เข้าสู่ระบบไม่สำเร็จ:", error.code);
    console.error("❌ ข้อผิดพลาด:", error.message);

    if (error.code === 'auth/user-not-found') {
      console.log("💡 แนะนำ: ผู้ใช้ไม่มีอยู่ในระบบ ต้องสร้างบัญชีก่อน");
    } else if (error.code === 'auth/wrong-password') {
      console.log("💡 แนะนำ: รหัสผ่านไม่ถูกต้อง");
    } else if (error.code === 'auth/invalid-email') {
      console.log("💡 แนะนำ: รูปแบบอีเมลไม่ถูกต้อง");
    }
    return { success: false, reason: error.code, message: error.message };
  }
}

// รันการทดสอบหลายผู้ใช้
async function runFullAuthTests() {
  const results = [];

  for (const testUser of testUsers) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🧪 Testing user: ${testUser.email}`);

    // ทดสอบสร้างบัญชี
    const createResult = await testCreateUser(testUser.email, testUser.password);

    // ทดสอบเข้าสู่ระบบ
    const loginResult = await testLogin(testUser.email, testUser.password);

    results.push({
      email: testUser.email,
      create: createResult,
      login: loginResult
    });
  }

  // สรุปผล
  console.log(`\n${'='.repeat(50)}`);
  console.log("📊 สรุปผลการทดสอบ:");
  results.forEach(result => {
    console.log(`\n👤 ${result.email}:`);
    console.log(`   📝 Create: ${result.create.success ? '✅' : '❌'} ${result.create.reason || ''}`);
    console.log(`   🔐 Login:  ${result.login.success ? '✅' : '❌'} ${result.login.reason || ''}`);
  });

  const successfulLogins = results.filter(r => r.login.success).length;
  console.log(`\n🎯 การเข้าสู่ระบบสำเร็จ: ${successfulLogins}/${results.length}`);

  process.exit(0);
}

// รันการทดสอบอย่างง่าย (user1@sample.com เท่านั้น)
async function runQuickTest() {
  const testUser = testUsers[0];
  console.log(`🚀 Quick test for: ${testUser.email}`);

  await testCreateUser(testUser.email, testUser.password);
  await testLogin(testUser.email, testUser.password);

  process.exit(0);
}

// เลือกการทดสอบตามอาร์กิวเมนต์
const args = process.argv.slice(2);
if (args.includes('--full')) {
  runFullAuthTests();
} else {
  runQuickTest();
}
