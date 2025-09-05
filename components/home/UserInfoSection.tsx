import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface UserInfoSectionProps {
  userEmail?: string;
  isEmailVerified: boolean;
  onLogout: () => void;
  onTestNotification: () => void;
  onScheduledNotification: () => void;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  userEmail,
  isEmailVerified,
  onLogout,
  onTestNotification,
  onScheduledNotification,
}) => {
  return (
    <ThemedView style={styles.userContainer}>
      <ThemedText type="subtitle">ข้อมูลผู้ใช้</ThemedText>
      <ThemedText>อีเมล: {userEmail || "ไม่ระบุ"}</ThemedText>
      <ThemedText>
        สถานะ: {isEmailVerified ? "✅ ยืนยันแล้ว" : "⚠️ ยังไม่ยืนยัน"}
      </ThemedText>

      <TouchableOpacity style={styles.quickLogoutButton} onPress={onLogout}>
        <ThemedText style={styles.logoutButtonText}>ออกจากระบบ</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.testNotificationButton}
        onPress={onTestNotification}
      >
        <ThemedText style={styles.notificationButtonText}>
          🔔 ทดสอบ Push Notification
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.scheduledNotificationButton}
        onPress={onScheduledNotification}
      >
        <ThemedText style={styles.scheduledButtonText}>
          ⏰ ตั้งเวลาแจ้งเตือน (10 วินาที)
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  quickLogoutButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "600",
  },
  testNotificationButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  notificationButtonText: {
    color: "white",
    fontWeight: "600",
  },
  scheduledNotificationButton: {
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  scheduledButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
