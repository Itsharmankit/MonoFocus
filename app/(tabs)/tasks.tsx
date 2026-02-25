import { TaskItem } from "@/components/TaskItem";
import { theme } from "@/constants/theme";
import { AppData, loadData, saveData, Task } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function TasksScreen() {
  const [data, setData] = useState<AppData>({
    sessionsCompleted: 0,
    completedToday: 0,
    currentStreak: 0,
    lastCompletedDate: "",
    tasks: [],
  });
  const [inputText, setInputText] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadAppData = async () => {
        const loadedData = await loadData();
        setData(loadedData);
      };
      loadAppData();
    }, []),
  );

  const handleAddTask = useCallback(async () => {
    const trimmed = inputText.trim();
    if (trimmed === "") {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmed,
      completed: false,
      sessionsSpent: 0,
    };

    setData((prev) => {
      const updatedData = {
        ...prev,
        tasks: [...prev.tasks, newTask],
      };
      void saveData(updatedData);
      return updatedData;
    });
    setInputText("");
  }, [inputText]);

  const handleToggleTask = useCallback((taskId: string) => {
    setData((prev) => {
      const updatedTasks = prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      );

      const updatedData = {
        ...prev,
        tasks: updatedTasks,
      };

      void saveData(updatedData);
      return updatedData;
    });
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setData((prev) => {
      const updatedTasks = prev.tasks.filter((task) => task.id !== taskId);

      const updatedData = {
        ...prev,
        tasks: updatedTasks,
      };

      void saveData(updatedData);
      return updatedData;
    });
  }, []);

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={() => handleToggleTask(item.id)}
      onDelete={() => handleDeleteTask(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No tasks yet. Add one above.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor={theme.colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTask}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data.tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
      />
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
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.default,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.bodySize,
    color: theme.colors.textPrimary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySize,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: theme.spacing.lg,
  },
  emptyContainer: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: theme.typography.bodySize,
    color: theme.colors.textMuted,
    textAlign: "center",
  },
});
