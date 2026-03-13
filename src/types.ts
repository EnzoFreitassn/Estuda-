export interface Task {
  id: string;
  title: string;
  day: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  duration: number;
  days: string[];
}

export interface Stats {
  minutesStudied: number;
  tasksCompleted: number;
  streak: number;
  lastStudyDate: string;
}
