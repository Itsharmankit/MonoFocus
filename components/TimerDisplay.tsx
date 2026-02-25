import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface TimerDisplayProps {
  timeLeft: number;
  isCompleted: boolean;
  isRunning: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isCompleted,
  isRunning,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRunning) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning, pulseAnim]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((1500 - timeLeft) / 1500) * 100;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.ringContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.ring}>
          <View
            style={[
              styles.progressOverlay,
              {
                opacity: progress / 100,
                borderColor: isCompleted
                  ? theme.colors.success
                  : theme.colors.primary,
              },
            ]}
          />
          <View style={styles.innerCircle}>
            {isCompleted ? (
              <Text style={styles.completedIcon}>✅</Text>
            ) : (
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing.xl,
  },
  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: theme.colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
  },
  progressOverlay: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
  },
  innerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: theme.typography.timerSize,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  completedIcon: {
    fontSize: 80,
  },
});
