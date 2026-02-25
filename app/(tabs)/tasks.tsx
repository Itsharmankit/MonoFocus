import { TaskItem } from "@/components/TaskItem";
import { theme } from "@/constants/theme";
import { AppData, loadData, saveData, Task } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
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
  const [dueDateInput, setDueDateInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [sortByCompleted, setSortByCompleted] = useState(true);
  const isInitialLoad = useRef(true);

  useFocusEffect(
    useCallback(() => {
      const loadAppData = async () => {
        const loadedData = await loadData();
        setData(loadedData);
      };
      loadAppData();
    }, []),
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    void saveData(data);
  }, [data]);

  const handleChangeInput = useCallback((value: string) => {
    setInputText(value);
  }, []);

  const handleChangeDueDate = useCallback((value: string) => {
    setDueDateInput(value);
  }, []);

  const handleChangeEditText = useCallback((value: string) => {
    setEditingText(value);
  }, []);

  const isValidDateString = useCallback((value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    const parsed = new Date(`${value}T00:00:00`);
    return !Number.isNaN(parsed.getTime());
  }, []);

  const handleAddTask = useCallback(() => {
    const trimmed = inputText.trim();
    if (trimmed === "") {
      return;
    }

    const trimmedDueDate = dueDateInput.trim();
    const dueDate = isValidDateString(trimmedDueDate) ? trimmedDueDate : "";

    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmed,
      completed: false,
      sessionsSpent: 0,
      dueDate,
    };

    const updatedData = {
      ...data,
      tasks: [...data.tasks, newTask],
    };

    setData(updatedData);
    void saveData(updatedData);
    setInputText("");
    setDueDateInput("");
  }, [data, inputText, dueDateInput, isValidDateString]);

  const handleToggleTask = useCallback(
    (taskId: string) => {
      const updatedTasks = data.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      );

      const updatedData = {
        ...data,
        tasks: updatedTasks,
      };

      setData(updatedData);
      void saveData(updatedData);
    },
    [data],
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      const updatedTasks = data.tasks.filter((task) => task.id !== taskId);

      const updatedData = {
        ...data,
        tasks: updatedTasks,
      };

      setData(updatedData);
      void saveData(updatedData);
      if (editingId === taskId) {
        setEditingId(null);
        setEditingText("");
      }
    },
    [data, editingId],
  );

  const handleStartEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingId) {
      return;
    }

    const trimmed = editingText.trim();
    if (trimmed === "") {
      return;
    }

    const updatedTasks = data.tasks.map((task) =>
      task.id === editingId ? { ...task, title: trimmed } : task,
    );

    const updatedData = {
      ...data,
      tasks: updatedTasks,
    };

    setData(updatedData);
    void saveData(updatedData);

    setEditingId(null);
    setEditingText("");
  }, [data, editingId, editingText]);

  const handleClearCompleted = useCallback(() => {
    const updatedTasks = data.tasks.filter((task) => !task.completed);

    const updatedData = {
      ...data,
      tasks: updatedTasks,
    };

    setData(updatedData);
    void saveData(updatedData);
    setEditingId(null);
    setEditingText("");
  }, [data]);

  const handleToggleSort = useCallback(() => {
    setSortByCompleted((prev) => !prev);
  }, []);

  const { totalCount, completedCount, activeCount } = useMemo(() => {
    const total = data.tasks.length;
    const completed = data.tasks.filter((task) => task.completed).length;
    return {
      totalCount: total,
      completedCount: completed,
      activeCount: total - completed,
    };
  }, [data.tasks]);

  const displayedTasks = useMemo(() => {
    if (!sortByCompleted) {
      return data.tasks;
    }

    return [...data.tasks].sort(
      (a, b) => Number(a.completed) - Number(b.completed),
    );
  }, [data.tasks, sortByCompleted]);

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={() => handleToggleTask(item.id)}
      onDelete={() => handleDeleteTask(item.id)}
      isEditing={editingId === item.id}
      editText={editingId === item.id ? editingText : item.title}
      onChangeEditText={handleChangeEditText}
      onStartEdit={() => handleStartEdit(item)}
      onSaveEdit={handleSaveEdit}
      onCancelEdit={handleCancelEdit}
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

      <View style={styles.countersRow}>
        <Text style={styles.counterText}>Total: {totalCount}</Text>
        <Text style={styles.counterText}>Active: {activeCount}</Text>
        <Text style={styles.counterText}>Done: {completedCount}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor={theme.colors.textMuted}
          value={inputText}
          onChangeText={handleChangeInput}
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

      <View style={styles.dueDateRow}>
        <TextInput
          style={styles.dueDateInput}
          placeholder="Due date (YYYY-MM-DD)"
          placeholderTextColor={theme.colors.textMuted}
          value={dueDateInput}
          onChangeText={handleChangeDueDate}
          returnKeyType="done"
        />
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleClearCompleted}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Clear Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleToggleSort}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>
            {sortByCompleted ? "Sort: Incomplete First" : "Sort: Default"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedTasks}
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
  countersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  counterText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.captionSize,
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
  dueDateRow: {
    marginBottom: theme.spacing.md,
  },
  dueDateInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.default,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.bodySize,
    color: theme.colors.textPrimary,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.default,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.captionSize,
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
