import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

// ขออนุญาตใช้กล้อง
export const requestCameraPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "ข้อผิดพลาด",
        "แอปต้องการสิทธิ์ในการเข้าถึงกล้องเพื่อถ่ายรูป"
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Camera permission error:", error);
    return false;
  }
};

// เปิดกล้องถ่ายรูป
export const openCamera = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  } catch (error: any) {
    console.error("Camera error:", error);
    Alert.alert("ข้อผิดพลาด", `ไม่สามารถเปิดกล้องได้: ${error.message}`);
    return null;
  }
};

// เปิด gallery เลือกรูป
export const openImagePicker = async (): Promise<string | null> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "ข้อผิดพลาด",
        "แอปต้องการสิทธิ์ในการเข้าถึงรูปภาพเพื่อเลือกรูป"
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  } catch (error: any) {
    console.error("Image picker error:", error);
    Alert.alert("ข้อผิดพลาด", `ไม่สามารถเลือกรูปได้: ${error.message}`);
    return null;
  }
};

// แสดง action sheet เลือกระหว่างกล้องหรือ gallery
export const showImagePickerOptions = (): Promise<string | null> => {
  return new Promise((resolve) => {
    Alert.alert("เลือกรูปภาพ", "คุณต้องการเลือกรูปภาพจากที่ไหน?", [
      {
        text: "ยกเลิก",
        style: "cancel",
        onPress: () => resolve(null),
      },
      {
        text: "📷 ถ่ายรูป",
        onPress: async () => {
          const result = await openCamera();
          resolve(result);
        },
      },
      {
        text: "🖼️ เลือกจากอัลบั้ม",
        onPress: async () => {
          const result = await openImagePicker();
          resolve(result);
        },
      },
    ]);
  });
};
