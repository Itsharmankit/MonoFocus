import React, { useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { theme } from "../constants/theme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = "solid",
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          variant === "solid" ? styles.solidButton : styles.ghostButton,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.label,
            variant === "solid" ? styles.solidLabel : styles.ghostLabel,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.default,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing.xs,
    minWidth: 200,
  },
  solidButton: {
    backgroundColor: theme.colors.primary,
  },
  ghostButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
  },
  label: {
    fontSize: theme.typography.bodySize,
    fontWeight: "bold",
  },
  solidLabel: {
    color: theme.colors.textPrimary,
  },
  ghostLabel: {
    color: theme.colors.textMuted,
  },
});
