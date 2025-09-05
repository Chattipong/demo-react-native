import {
  scheduleNotification,
  sendImmediateNotification,
  setupNotificationHandler,
} from "@/lib/services/notificationService";
import { useEffect, useState } from "react";

export const useNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // ตั้งค่า notification handler เมื่อ component mount
    setupNotificationHandler();
    setIsInitialized(true);
  }, []);

  const testPushNotification = async () => {
    const notificationId = await sendImmediateNotification(
      "🔔 ทดสอบ Push Notification",
      "นี่คือการแจ้งเตือนทดสอบจากแอปของคุณ!",
      { testData: "immediate" },
      2
    );

    if (notificationId) {
      // Alert.alert("สำเร็จ", "ส่งการแจ้งเตือนทดสอบแล้ว!\n\nจะแสดงใน 2 วินาที");
    }
  };

  const testScheduledNotification = async () => {
    const notificationId = await scheduleNotification(
      "⏰ การแจ้งเตือนตั้งเวลา",
      "นี่คือการทดสอบการแจ้งเตือนเมื่อออกจากแอป! ลองออกจากแอปแล้วรอดู",
      10,
      { testData: "scheduled" }
    );

    if (notificationId) {
      // Alert.alert(
      //   "ตั้งเวลาสำเร็จ",
      //   `การแจ้งเตือนจะแสดงใน 10 วินาที\n\nแนะนำ: ออกจากแอปแล้วรอดูการแจ้งเตือน\n\nID: ${notificationId}`
      // );
    }
  };

  return {
    isInitialized,
    testPushNotification,
    testScheduledNotification,
  };
};
