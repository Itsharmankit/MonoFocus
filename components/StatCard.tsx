import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.default,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    marginBottom: theme.spacing.md,
    ...theme.shadow,
  },
  icon: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.captionSize,
    color: theme.colors.textMuted,
  },
});
