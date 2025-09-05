import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebaseConfig";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const handleLogout = async () => {
    Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบหรือไม่?", [
      {
        text: "ยกเลิก",
        style: "cancel",
      },
      {
        text: "ออกจากระบบ",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut(auth);
            router.replace("/(auth)/login");
          } catch (error: any) {
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถออกจากระบบได้");
            console.error("Logout error:", error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.emailText}>{user?.email || "ไม่ระบุอีเมล"}</Text>
          <Text style={styles.statusText}>
            {user?.emailVerified
              ? "✅ ยืนยันอีเมลแล้ว"
              : "⚠️ ยังไม่ยืนยันอีเมล"}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ข้อมูลบัญชี</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user?.uid || "ไม่ระบุ"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>สร้างเมื่อ:</Text>
            <Text style={styles.infoValue}>
              {user?.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString(
                    "th-TH"
                  )
                : "ไม่ระบุ"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>เข้าสู่ระบบล่าสุด:</Text>
            <Text style={styles.infoValue}>
              {user?.metadata.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                    "th-TH"
                  )
                : "ไม่ระบุ"}
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={styles.logoutButtonText}>
              {loading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  profileContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  actionsSection: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
