import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";
import { Task } from "../utils/storage";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      <Text style={[styles.title, task.completed && styles.titleCompleted]}>
        {task.title}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.default,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  checkboxContainer: {
    marginRight: theme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    flex: 1,
    fontSize: theme.typography.bodySize,
    color: theme.colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textMuted,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  deleteIcon: {
    fontSize: 20,
  },
});
