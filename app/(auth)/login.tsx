import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebaseConfig";

// Google Sign-In functions with safe loading
const handleGoogleSignIn = async (): Promise<void> => {
  Alert.alert(
    "Google Sign-In ไม่พร้อมใช้งาน",
    "Google Sign-In ต้องการ Development Build\n\nในตอนนี้ใช้ Email/Password login ได้ครับ\n\nEmail: user168@sample.com\nPassword: 123456",
    [{ text: "ตกลง", style: "default" }]
  );
};

const configureGoogleSignInSafely = async (): Promise<void> => {
  // ปิด Google Sign-In ชั่วคราวสำหรับ Expo Go
  console.log("Google Sign-In ถูกปิดชั่วคราวสำหรับ Expo Go");
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // กำหนดค่า Google Sign-In เมื่อ component โหลด
  useEffect(() => {
    configureGoogleSignInSafely();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      console.log("🔐 Attempting login with:", { email, password });
      console.log("🔥 Auth object:", auth);
      console.log("🔥 Auth config:", auth.config);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Login successful! User:", userCredential.user.uid);

      Alert.alert("สำเร็จ", "เข้าสู่ระบบแล้ว", [
        { text: "ตกลง", onPress: () => router.replace("/(main)") },
      ]);
    } catch (error: any) {
      let errorMessage = "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "ไม่พบผู้ใช้นี้ในระบบ กรุณาสมัครสมาชิกก่อน";
          break;
        case "auth/wrong-password":
          errorMessage = "รหัสผ่านไม่ถูกต้อง";
          break;
        case "auth/invalid-email":
          errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
          break;
        case "auth/user-disabled":
          errorMessage = "บัญชีนี้ถูกปิดการใช้งาน";
          break;
        case "auth/too-many-requests":
          errorMessage = "มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่";
          break;
        default:
          errorMessage = `เข้าสู่ระบบไม่สำเร็จ: ${error.message}`;
      }

      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>เข้าสู่ระบบ</Text>
          <Text style={styles.subtitle}>ยินดีต้อนรับกลับ!</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="อีเมล"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="รหัสผ่าน"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Text>
          </TouchableOpacity>

          {/* ปุ่ม Google Sign-In */}
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>
              🔍 เข้าสู่ระบบด้วย Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton]}
            onPress={() => {
              setEmail("user168@sample.com");
              setPassword("123456");
            }}
          >
            <Text style={styles.testButtonText}>
              ทดสอบด่วน (user1@sample.com)
            </Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>ยังไม่มีบัญชี? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.link}>สมัครสมาชิก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    margin: 20,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#4285F4",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#4285F4",
  },
  googleButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#666",
    fontSize: 16,
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  testButton: {
    backgroundColor: "#FF9500",
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  testButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
