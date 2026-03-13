import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task, Stats } from '../types';

const DEFAULT_STATS: Stats = {
  minutesStudied: 0,
  tasksCompleted: 0,
  streak: 0,
  lastStudyDate: '',
};

export function useSupabaseData(userId: string | undefined) {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [stats, setStatsState] = useState<Stats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  // Load data on mount / user change
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      const [{ data: tasksData }, { data: statsData }] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('stats').select('*').eq('user_id', userId).single(),
      ]);

      if (tasksData) {
        setTasksState(tasksData.map((t: any) => ({
          id: t.id,
          title: t.title,
          day: t.day,
          completed: t.completed,
        })));
      }

      if (statsData) {
        setStatsState({
          minutesStudied: statsData.minutes_studied,
          tasksCompleted: statsData.tasks_completed,
          streak: statsData.streak,
          lastStudyDate: statsData.last_study_date,
        });
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const addTask = useCallback(async (title: string, day: string) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: userId, title, day })
      .select()
      .single();

    if (!error && data) {
      setTasksState(prev => [...prev, {
        id: data.id, title: data.title, day: data.day, completed: data.completed
      }]);
    }
  }, [userId]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !userId) return;
    const newCompleted = !task.completed;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: newCompleted })
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      setTasksState(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
      // Update stats counter optimistically
      const delta = newCompleted ? 1 : -1;
      await updateStats({ tasksCompleted: Math.max(0, stats.tasksCompleted + delta) });
    }
  }, [tasks, userId, stats]);

  const removeTask = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) {
      setTasksState(prev => prev.filter(t => t.id !== id));
    }
  }, [userId]);

  const addTasks = useCallback(async (newTasks: Omit<Task, 'id'>[]) => {
    if (!userId) return;
    const rows = newTasks.map(t => ({ user_id: userId, title: t.title, day: t.day, completed: false }));
    const { data, error } = await supabase.from('tasks').insert(rows).select();
    if (!error && data) {
      setTasksState(prev => [
        ...prev,
        ...data.map((t: any) => ({ id: t.id, title: t.title, day: t.day, completed: t.completed }))
      ]);
    }
  }, [userId]);

  const clearAllTasks = useCallback(async () => {
    if (!userId) return;
    const { error } = await supabase.from('tasks').delete().eq('user_id', userId);
    if (!error) setTasksState([]);
  }, [userId]);

  const updateStats = useCallback(async (partial: Partial<Stats>) => {
    if (!userId) return;
    const merged = { ...stats, ...partial };
    setStatsState(merged);

    await supabase.from('stats').upsert({
      user_id: userId,
      minutes_studied: merged.minutesStudied,
      tasks_completed: merged.tasksCompleted,
      streak: merged.streak,
      last_study_date: merged.lastStudyDate,
    }, { onConflict: 'user_id' });
  }, [userId, stats]);

  return { tasks, stats, loading, addTask, addTasks, toggleTask, removeTask, clearAllTasks, updateStats };
}
