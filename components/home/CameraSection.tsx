import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CameraSectionProps {
  selectedImage: string | null;
  isLoading: boolean;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onShowOptions: () => void;
  onClearImage: () => void;
}

export const CameraSection: React.FC<CameraSectionProps> = ({
  selectedImage,
  isLoading,
  onTakePhoto,
  onPickImage,
  onShowOptions,
  onClearImage,
}) => {
  return (
    <ThemedView style={styles.cameraContainer}>
      <ThemedText type="subtitle">การจัดการรูปภาพ</ThemedText>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.clearButton} onPress={onClearImage}>
            <ThemedText style={styles.clearButtonText}>🗑️ ลบรูป</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cameraButton, isLoading && styles.disabledButton]}
          onPress={onTakePhoto}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <ThemedText style={styles.buttonText}>📷 ถ่ายรูป</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.galleryButton, isLoading && styles.disabledButton]}
          onPress={onPickImage}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <ThemedText style={styles.buttonText}>🖼️ เลือกรูป</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionsButton, isLoading && styles.disabledButton]}
          onPress={onShowOptions}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <ThemedText style={styles.buttonText}>📋 แสดงตัวเลือก</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  cameraButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  galleryButton: {
    backgroundColor: "#17a2b8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  optionsButton: {
    backgroundColor: "#6f42c1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  clearButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
