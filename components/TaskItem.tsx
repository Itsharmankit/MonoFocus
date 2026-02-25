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
  isShowingNotes: boolean;
  onToggleNotes: () => void;
  notesText: string;
  onChangeNotesText: (value: string) => void;
  onSaveNotes: () => void;
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
  isShowingNotes,
  onToggleNotes,
  notesText,
  onChangeNotesText,
  onSaveNotes,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerInner}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              task.completed && styles.checkboxCompleted,
            ]}
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
            <Text
              style={[styles.title, task.completed && styles.titleCompleted]}
            >
              {task.title}
            </Text>
          )}
          {task.dueDate ? (
            <Text style={styles.dueDateText}>Due: {task.dueDate}</Text>
          ) : null}
          {task.notes ? (
            <Text style={styles.notesPreview}>
              💬 {task.notes.substring(0, 50)}...
            </Text>
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
                onPress={onToggleNotes}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>💬</Text>
              </TouchableOpacity>
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
      {isShowingNotes && !isEditing ? (
        <View style={styles.notesPanel}>
          <TextInput
            style={styles.notesInput}
            value={notesText}
            onChangeText={onChangeNotesText}
            placeholder="Add notes about this task..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.saveNotesButton}
            onPress={onSaveNotes}
            activeOpacity={0.7}
          >
            <Text style={styles.saveNotesText}>Save Notes</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.default,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
  },
  containerInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
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
  notesPreview: {
    fontSize: theme.typography.captionSize,
    color: theme.colors.cyan,
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
  notesPanel: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.card,
    padding: theme.spacing.md,
  },
  notesInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.default,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.bodySize,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    minHeight: 80,
  },
  saveNotesButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  saveNotesText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySize,
    fontWeight: "bold",
  },
});
