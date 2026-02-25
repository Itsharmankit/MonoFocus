import { PrimaryButton } from "@/components/PrimaryButton";
import { TimerDisplay } from "@/components/TimerDisplay";
import { theme } from "@/constants/theme";
import {
    AppData,
    loadData,
    saveData,
    updateDataOnSessionComplete,
} from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, Vibration, View } from "react-native";

export default function FocusTimerScreen() {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [data, setData] = useState<AppData>({
    sessionsCompleted: 0,
    completedToday: 0,
    currentStreak: 0,
    lastCompletedDate: "",
    tasks: [],
  });

  useFocusEffect(
    useCallback(() => {
      const loadAppData = async () => {
        const loadedData = await loadData();
        setData(loadedData);
      };
      loadAppData();
    }, []),
  );

  const handleSessionComplete = useCallback(async () => {
    const updatedData = updateDataOnSessionComplete(data);
    setData(updatedData);
    await saveData(updatedData);
  }, [data]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      Vibration.vibrate(1000);
      handleSessionComplete();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, handleSessionComplete]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setSessionStarted(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    if (!isRunning) {
      setTimeLeft(1500);
      setIsCompleted(false);
      setSessionStarted(false);
    }
  }, [isRunning]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MonoFocus</Text>
        {data.currentStreak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {data.currentStreak}d</Text>
          </View>
        )}
      </View>

      <TimerDisplay
        timeLeft={timeLeft}
        isCompleted={isCompleted}
        isRunning={isRunning}
      />

      {isCompleted && (
        <Text style={styles.completionText}>Session Complete!</Text>
      )}

      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <PrimaryButton
            label={sessionStarted ? "▶ RESUME" : "▶ START"}
            onPress={handleStart}
            variant="solid"
          />
        ) : (
          <PrimaryButton
            label="⏸ PAUSE"
            onPress={handlePause}
            variant="solid"
          />
        )}
        <PrimaryButton label="↺ RESET" onPress={handleReset} variant="ghost" />
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>
          Today: {data.completedToday} sessions
        </Text>
        {data.currentStreak > 0 && (
          <Text style={styles.statText}>🔥{data.currentStreak}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.headerSize,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
  },
  streakBadge: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.default,
  },
  streakText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySize,
    fontWeight: "bold",
  },
  completionText: {
    fontSize: 20,
    color: theme.colors.success,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  statText: {
    fontSize: theme.typography.bodySize,
    color: theme.colors.textMuted,
  },
});
