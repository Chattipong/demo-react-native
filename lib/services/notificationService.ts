import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

// ตั้งค่าการจัดการ notifications
export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

// ขออนุญาตการแจ้งเตือน
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== "granted") {
      Alert.alert("ข้อผิดพลาด", "ไม่ได้รับอนุญาตให้แสดงการแจ้งเตือน");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Permission request error:", error);
    return false;
  }
};

// ส่งการแจ้งเตือนทันที
export const sendImmediateNotification = async (
  title: string,
  body: string,
  data?: any,
  delaySeconds: number = 2
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySeconds,
      },
    });

    return notificationId;
  } catch (error: any) {
    console.error("Send notification error:", error);
    Alert.alert("ข้อผิดพลาด", `ไม่สามารถส่งการแจ้งเตือนได้: ${error.message}`);
    return null;
  }
};

// ส่งการแจ้งเตือนตั้งเวลา
export const scheduleNotification = async (
  title: string,
  body: string,
  delaySeconds: number,
  data?: any
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySeconds,
      },
    });

    return notificationId;
  } catch (error: any) {
    console.error("Schedule notification error:", error);
    Alert.alert(
      "ข้อผิดพลาด",
      `ไม่สามารถตั้งเวลาการแจ้งเตือนได้: ${error.message}`
    );
    return null;
  }
};

// ยกเลิกการแจ้งเตือนทั้งหมด
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Cancel notifications error:", error);
  }
};

// ยกเลิกการแจ้งเตือนตาม ID
export const cancelNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Cancel notification error:", error);
  }
};
