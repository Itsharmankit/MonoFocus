import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { theme } from "../constants/theme";
import { Task } from "../utils/storage";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  isEditing: boolean;
  editText: string;
  onChangeEditText: (value: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  isEditing,
  editText,
  onChangeEditText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
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
      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={onChangeEditText}
            placeholder="Edit task title"
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={onSaveEdit}
          />
        ) : (
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>
        )}
        {task.dueDate ? (
          <Text style={styles.dueDateText}>Due: {task.dueDate}</Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSaveEdit}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>✅</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onCancelEdit}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>✕</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onStartEdit}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🗑</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  content: {
    flex: 1,
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
    fontSize: theme.typography.bodySize,
    color: theme.colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textMuted,
  },
  editInput: {
    fontSize: theme.typography.bodySize,
    color: theme.colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.textMuted,
    paddingVertical: theme.spacing.xs,
  },
  dueDateText: {
    fontSize: theme.typography.captionSize,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
});
