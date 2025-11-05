import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { seedDatabase } from "../scripts/seedData";

export default function SeedButton() {
  const handleSeed = async () => {
    Alert.alert(
      "เพิ่มข้อมูลตัวอย่าง",
      "ต้องการเพิ่มข้อมูลร้านอาหารตัวอย่างใช่หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ตกลง",
          onPress: async () => {
            try {
              await seedDatabase();
              Alert.alert("สำเร็จ", "เพิ่มข้อมูลเรียบร้อย!");
            } catch (error: any) {
              Alert.alert("ข้อผิดพลาด", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSeed}>
      <Text style={styles.buttonText}>เพิ่มข้อมูลตัวอย่าง</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 12,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
