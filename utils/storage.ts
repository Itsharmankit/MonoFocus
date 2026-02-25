import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "monofocus_data";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  sessionsSpent: number;
  dueDate?: string;
  notes?: string;
}

export interface AppData {
  sessionsCompleted: number;
  completedToday: number;
  currentStreak: number;
  lastCompletedDate: string;
  tasks: Task[];
}

const getDefaultData = (): AppData => ({
  sessionsCompleted: 0,
  completedToday: 0,
  currentStreak: 0,
  lastCompletedDate: "",
  tasks: [],
});

const normalizeData = (data: AppData): AppData => {
  const normalizedTasks = data.tasks.map((task) => ({
    ...task,
    completed: Boolean(task.completed),
    sessionsSpent: task.sessionsSpent ?? 0,
    dueDate: task.dueDate ?? "",
    notes: task.notes ?? "",
  }));

  return {
    ...data,
    tasks: normalizedTasks,
  };
};

const getToday = (): string => {
  return new Date().toISOString().split("T")[0];
};

const getYesterday = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

export const checkAndUpdateStreak = (data: AppData): AppData => {
  const today = getToday();
  const yesterday = getYesterday();
  const lastDate = data.lastCompletedDate;

  if (lastDate === today) {
    return data;
  }

  if (lastDate === yesterday) {
    return data;
  }

  return {
    ...data,
    currentStreak: 0,
    completedToday: 0,
  };
};

export const updateDataOnSessionComplete = (data: AppData): AppData => {
  const today = getToday();
  const yesterday = getYesterday();
  const lastDate = data.lastCompletedDate;

  let newStreak = data.currentStreak;

  if (lastDate === "") {
    newStreak = 1;
  } else if (lastDate === yesterday) {
    newStreak = data.currentStreak + 1;
  } else if (lastDate === today) {
    newStreak = data.currentStreak;
  } else {
    newStreak = 1;
  }

  return {
    ...data,
    sessionsCompleted: data.sessionsCompleted + 1,
    completedToday: data.completedToday + 1,
    currentStreak: newStreak,
    lastCompletedDate: today,
  };
};

export const loadData = async (): Promise<AppData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue === null) {
      return getDefaultData();
    }
    const data = normalizeData(JSON.parse(jsonValue) as AppData);
    return checkAndUpdateStreak(data);
  } catch (error) {
    console.error("Error loading data:", error);
    return getDefaultData();
  }
};

export const saveData = async (data: AppData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving data:", error);
  }
};
