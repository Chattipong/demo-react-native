import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { usePathname } from "expo-router";

export const useTabBarVisibility = () => {
  const pathname = usePathname();
  const tabBarHeight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Hide tab bar on specific screens
    const shouldHideTabBar = pathname.includes("/restaurant/");

    Animated.timing(tabBarHeight, {
      toValue: shouldHideTabBar ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [pathname, tabBarHeight]);

  return tabBarHeight;
};
