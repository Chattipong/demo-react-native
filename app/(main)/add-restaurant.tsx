import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { addRestaurant } from "../../lib/services/restaurantService";

export default function AddRestaurantScreen() {
  const [formData, setFormData] = useState({
    name: "ร้านส้มตำป้าแดง",
    description: "ส้มตำรสจัดจ้าน อาหารอีสานต้นตำรับ",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800",
    category: "thai",
    rating: "4.5",
    deliveryTime: "30-40 นาที",
    deliveryFee: "25",
    minimumOrder: "50",
    isOpen: true,
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "thai", name: "อาหารไทย", icon: "🌶️" },
    { id: "japanese", name: "ญี่ปุ่น", icon: "🍣" },
    { id: "western", name: "ฝรั่ง", icon: "🍔" },
    { id: "chinese", name: "จีน", icon: "🥟" },
    { id: "cafe", name: "คาเฟ่", icon: "☕" },
  ];

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อร้าน");
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกคำอธิบาย");
      return;
    }

    try {
      setLoading(true);

      const restaurantData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image:
          formData.image.trim() ||
          "https://via.placeholder.com/400x200?text=Restaurant",
        category: formData.category,
        rating: parseFloat(formData.rating) || 4.5,
        deliveryTime: formData.deliveryTime.trim(),
        deliveryFee: parseFloat(formData.deliveryFee) || 0,
        minimumOrder: parseFloat(formData.minimumOrder) || 0,
        isOpen: formData.isOpen,
        address: "กรุงเทพมหานคร", // Default address
      };

      await addRestaurant(restaurantData);

      Alert.alert("สำเร็จ", "เพิ่มร้านอาหารเรียบร้อย", [
        {
          text: "ตกลง",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("ข้อผิดพลาด", error.message || "ไม่สามารถเพิ่มร้านอาหารได้");
      console.error("Error adding restaurant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← กลับ</Text>
        </TouchableOpacity>
        <Text style={styles.title}>เพิ่มร้านอาหาร</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        {/* ชื่อร้าน */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>ชื่อร้าน *</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น ส้มตำป้าแดง"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        {/* คำอธิบาย */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>คำอธิบาย *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="เช่น ส้มตำรสจัดจ้าน อาหารอีสานต้นตำรับ"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={3}
          />
        </View>

        {/* รูปภาพ URL */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>URL รูปภาพ (ถ้ามี)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChangeText={(text) => setFormData({ ...formData, image: text })}
            autoCapitalize="none"
          />
        </View>

        {/* หมวดหมู่ */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>หมวดหมู่</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    formData.category === category.id &&
                      styles.categoryChipActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, category: category.id })
                  }
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === category.id &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* คะแนน */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>คะแนน (0-5)</Text>
          <TextInput
            style={styles.input}
            placeholder="4.5"
            value={formData.rating}
            onChangeText={(text) => setFormData({ ...formData, rating: text })}
            keyboardType="decimal-pad"
          />
        </View>

        {/* เวลาจัดส่ง */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>เวลาจัดส่ง</Text>
          <TextInput
            style={styles.input}
            placeholder="30-40 นาที"
            value={formData.deliveryTime}
            onChangeText={(text) =>
              setFormData({ ...formData, deliveryTime: text })
            }
          />
        </View>

        {/* ค่าจัดส่ง */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>ค่าจัดส่ง (บาท)</Text>
          <TextInput
            style={styles.input}
            placeholder="25"
            value={formData.deliveryFee}
            onChangeText={(text) =>
              setFormData({ ...formData, deliveryFee: text })
            }
            keyboardType="decimal-pad"
          />
        </View>

        {/* ยอดสั่งขั้นต่ำ */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>ยอดสั่งขั้นต่ำ (บาท)</Text>
          <TextInput
            style={styles.input}
            placeholder="50"
            value={formData.minimumOrder}
            onChangeText={(text) =>
              setFormData({ ...formData, minimumOrder: text })
            }
            keyboardType="decimal-pad"
          />
        </View>

        {/* สถานะเปิด-ปิด */}
        <View style={styles.formGroup}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>เปิดให้บริการ</Text>
            <Switch
              value={formData.isOpen}
              onValueChange={(value) =>
                setFormData({ ...formData, isOpen: value })
              }
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "กำลังเพิ่ม..." : "✅ เพิ่มร้านอาหาร"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 60,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "white",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
