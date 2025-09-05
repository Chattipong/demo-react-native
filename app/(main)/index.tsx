import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CameraSection } from "@/components/home/CameraSection";
import { InstructionSteps } from "@/components/home/InstructionSteps";
import { UserInfoSection } from "@/components/home/UserInfoSection";
import { useAuth } from "@/hooks/useAuth";
import { useCamera } from "@/hooks/useCamera";
import { useNotifications } from "@/hooks/useNotifications";

export default function HomeScreen() {
  const { user, isEmailVerified, handleQuickLogout } = useAuth();
  const { testPushNotification, testScheduledNotification } =
    useNotifications();
  const {
    selectedImage,
    isLoading,
    takePhoto,
    pickImage,
    showImageOptions,
    clearImage,
  } = useCamera();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ paddingTop: 20 }}>
          ยินดีต้อนรับ!
        </ThemedText>
        <HelloWave />
      </ThemedView>

      <UserInfoSection
        userEmail={user?.email || undefined}
        isEmailVerified={isEmailVerified}
        onLogout={handleQuickLogout}
        onTestNotification={testPushNotification}
        onScheduledNotification={testScheduledNotification}
      />

      <CameraSection
        selectedImage={selectedImage}
        isLoading={isLoading}
        onTakePhoto={takePhoto}
        onPickImage={pickImage}
        onShowOptions={showImageOptions}
        onClearImage={clearImage}
      />

      <InstructionSteps />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
