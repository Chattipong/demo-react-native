import {
  openCamera,
  openImagePicker,
  showImagePickerOptions,
} from "@/lib/services/cameraService";
import { useState } from "react";
import { Alert } from "react-native";

export const useCamera = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = async () => {
    setIsLoading(true);
    try {
      const imageUri = await openCamera();
      if (imageUri) {
        setSelectedImage(imageUri);
        Alert.alert("สำเร็จ", "ถ่ายรูปเรียบร้อยแล้ว!");
      }
    } catch (error) {
      console.error("Take photo error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    setIsLoading(true);
    try {
      const imageUri = await openImagePicker();
      if (imageUri) {
        setSelectedImage(imageUri);
        Alert.alert("สำเร็จ", "เลือกรูปเรียบร้อยแล้ว!");
      }
    } catch (error) {
      console.error("Pick image error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showImageOptions = async () => {
    setIsLoading(true);
    try {
      const imageUri = await showImagePickerOptions();
      if (imageUri) {
        setSelectedImage(imageUri);
        Alert.alert("สำเร็จ", "ได้รูปภาพแล้ว!");
      }
    } catch (error) {
      console.error("Image options error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    isLoading,
    takePhoto,
    pickImage,
    showImageOptions,
    clearImage,
  };
};
