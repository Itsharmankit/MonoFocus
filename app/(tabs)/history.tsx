import { StatCard } from "@/components/StatCard";
import { theme } from "@/constants/theme";
import { AppData, loadData } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
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

  const completedTasks = data.tasks.filter((task) => task.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Progress</Text>

      <View style={styles.statsGrid}>
        <StatCard icon="🔥" value={data.currentStreak} label="Day Streak" />
        <StatCard icon="✅" value={data.sessionsCompleted} label="Total" />
        <StatCard icon="📅" value={data.completedToday} label="Today" />
        <StatCard icon="✓" value={completedTasks} label="Tasks Done" />
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
    fontSize: theme.typography.headerSize,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
