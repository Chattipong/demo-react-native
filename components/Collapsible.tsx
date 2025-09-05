import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export interface CollapsibleProps extends PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
}

export function Collapsible({
  children,
  title,
  defaultOpen = false,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const theme = useColorScheme() ?? "light";

  const toggleCollapsible = () => {
    setIsOpen((value) => !value);
  };

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={toggleCollapsible}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityHint={`${isOpen ? "Collapse" : "Expand"} ${title} section`}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    paddingTop: 8,
  },
});
