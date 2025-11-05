import { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import {
  clearRestaurants,
  getAllStats,
  resetDatabase,
} from "../scripts/firestoreHelpers";
import { seedDatabase } from "../scripts/seedData";

export default function DatabaseManager() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  const handleGetStats = async () => {
    try {
      setLoading(true);
      const result = await getAllStats();
      setStats(result);

      const message = Object.entries(result)
        .map(([collection, count]) => `${collection}: ${count} รายการ`)
        .join("\n");

      Alert.alert("📊 สถิติฐานข้อมูล", message);
    } catch (error: any) {
      Alert.alert("ข้อผิดพลาด", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAndReseed = async () => {
    Alert.alert(
      "🔄 ล้างและเพิ่มข้อมูลใหม่",
      "ต้องการลบข้อมูลเก่าทั้งหมด และเพิ่มข้อมูลตัวอย่างใหม่ใช่หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ดำเนินการ",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              // Step 1: Clear old data
              await clearRestaurants();

              // Step 2: Add new data
              await seedDatabase();

              Alert.alert("✅ สำเร็จ", "ล้างและเพิ่มข้อมูลใหม่เรียบร้อย!");
              setStats(null);
            } catch (error: any) {
              Alert.alert("❌ ข้อผิดพลาด", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClear = async () => {
    Alert.alert("⚠️ ลบข้อมูล", "ต้องการลบร้านอาหารทั้งหมดใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await clearRestaurants();
            Alert.alert("สำเร็จ", "ลบข้อมูลเรียบร้อย");
            setStats(null);
          } catch (error: any) {
            Alert.alert("ข้อผิดพลาด", error.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleReset = async () => {
    Alert.alert(
      "🔄 รีเซ็ตฐานข้อมูล",
      "ต้องการลบและเพิ่มข้อมูลใหม่ใช่หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "รีเซ็ต",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await resetDatabase();
              Alert.alert("สำเร็จ", "รีเซ็ตฐานข้อมูลเรียบร้อย");
              await handleGetStats();
            } catch (error: any) {
              Alert.alert("ข้อผิดพลาด", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>กำลังดำเนินการ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ จัดการฐานข้อมูล</Text>

      {stats && (
        <View style={styles.statsContainer}>
          {Object.entries(stats).map(([collection, count]) => (
            <View key={collection} style={styles.statRow}>
              <Text style={styles.statLabel}>{collection}:</Text>
              <Text style={styles.statValue}>{count} รายการ</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={handleGetStats}
        >
          <Text style={styles.buttonText}>📊 ดูสถิติ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleClear}
        >
          <Text style={styles.buttonText}>🗑️ ลบข้อมูล</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.successButton, styles.fullWidth]}
        onPress={handleClearAndReseed}
      >
        <Text style={styles.buttonText}>🔄 ล้างและเพิ่มข้อมูลใหม่</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.warningButton, styles.fullWidth]}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>⚙️ รีเซ็ตฐานข้อมูล</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  statsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  fullWidth: {
    flex: 1,
  },
  infoButton: {
    backgroundColor: "#007AFF",
  },
  dangerButton: {
    backgroundColor: "#FF3B30",
  },
  successButton: {
    backgroundColor: "#34C759",
  },
  warningButton: {
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
});
