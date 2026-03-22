import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calendar as CalendarIcon, Check, Wand2, Loader2, AlertTriangle } from 'lucide-react';
import { Task, Stats } from '../types';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

// Unique color scheme per day
const DAY_COLORS: Record<string, {
  card: string; header: string; icon: string; badge: string; ring: string; check: string;
}> = {
  'Segunda':  { card: 'bg-blue-50 border-blue-200',    header: 'text-blue-700',   icon: 'text-blue-500',   badge: 'bg-blue-100 text-blue-700',   ring: 'focus:ring-blue-500',   check: 'bg-blue-500 border-blue-500' },
  'Terça':    { card: 'bg-purple-50 border-purple-200', header: 'text-purple-700', icon: 'text-purple-500', badge: 'bg-purple-100 text-purple-700', ring: 'focus:ring-purple-500', check: 'bg-purple-500 border-purple-500' },
  'Quarta':   { card: 'bg-emerald-50 border-emerald-200', header: 'text-emerald-700', icon: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700', ring: 'focus:ring-emerald-500', check: 'bg-emerald-500 border-emerald-500' },
  'Quinta':   { card: 'bg-orange-50 border-orange-200', header: 'text-orange-700', icon: 'text-orange-500', badge: 'bg-orange-100 text-orange-700', ring: 'focus:ring-orange-500', check: 'bg-orange-500 border-orange-500' },
  'Sexta':    { card: 'bg-rose-50 border-rose-200',     header: 'text-rose-700',   icon: 'text-rose-500',   badge: 'bg-rose-100 text-rose-700',   ring: 'focus:ring-rose-500',   check: 'bg-rose-500 border-rose-500' },
  'Sábado':   { card: 'bg-teal-50 border-teal-200',     header: 'text-teal-700',   icon: 'text-teal-500',   badge: 'bg-teal-100 text-teal-700',   ring: 'focus:ring-teal-500',   check: 'bg-teal-500 border-teal-500' },
  'Domingo':  { card: 'bg-amber-50 border-amber-200',   header: 'text-amber-700',  icon: 'text-amber-500',  badge: 'bg-amber-100 text-amber-700',  ring: 'focus:ring-amber-500',  check: 'bg-amber-500 border-amber-500' },
};

interface PlannerProps {
  tasks: Task[];
  addTask: (title: string, day: string) => Promise<void>;
  addTasks: (tasks: Omit<Task, 'id'>[]) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  stats: Stats;
  updateStats: (partial: Partial<Stats>) => Promise<void>;
}

export default function Planner({ tasks, addTask, addTasks, toggleTask, removeTask, clearAllTasks }: PlannerProps) {
  const [newTask, setNewTask] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(1);
  const [selectedDay, setSelectedDay] = useState('Segunda');
  const [activeTab, setActiveTab] = useState<'semana' | 'rotina'>('semana');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const [subjects, setSubjects] = useState([{ id: '1', name: '', hours: 1 }]);
  const [freeDays, setFreeDays] = useState<string[]>([]);

  const toggleFreeDay = (day: string) =>
    setFreeDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;
  const doneTasks = safeTasks.filter(t => t.completed).length;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setMessage('Digite o nome da tarefa antes de adicionar.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setSaving(true);
    const taskName = newTask.trim().toLowerCase().startsWith('estudar')
      ? newTask.trim()
      : `Estudar ${newTask.trim()}`;
    if (newTaskHours <= MAX_HOURS_PER_SESSION) {
      // Single task
      const label = `${taskName} (${newTaskHours}h)`;
      await addTask(label, selectedDay);
    } else {
      // Distribute across days
      const studyDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      const startIndex = studyDays.indexOf(selectedDay);
      const newTasks: Omit<Task, 'id'>[] = [];
      let remaining = newTaskHours;
      let offset = startIndex >= 0 ? startIndex : 0;
      while (remaining > 0) {
        const sessionHours = Math.min(remaining, MAX_HOURS_PER_SESSION);
        newTasks.push({
          title: `${taskName} (${sessionHours}h)`,
          day: studyDays[offset % studyDays.length],
          completed: false,
        });
        remaining -= sessionHours;
        offset++;
      }
      await addTasks(newTasks);
    }
    setNewTask('');
    setNewTaskHours(1);
    setMessage('');
    setSaving(false);
  };

  const handleClearAll = async () => {
    setClearing(true);
    await clearAllTasks();
    setClearing(false);
    setConfirmClear(false);
  };

  const addSubject = () => setSubjects([...subjects, { id: Date.now().toString(), name: '', hours: 1 }]);
  const updateSubject = (id: string, field: 'name' | 'hours', value: string | number) =>
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  const removeSubject = (id: string) => setSubjects(subjects.filter(s => s.id !== id));

  const MAX_HOURS_PER_SESSION = 2;

  const generateRoutine = async () => {
    const validSubjects = subjects.filter(s => s.name.trim() !== '');
    if (validSubjects.length === 0) {
      setMessage('Adicione pelo menos uma matéria para gerar a rotina.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newTasks: Omit<Task, 'id'>[] = [];
    const allDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const studyDays = allDays.filter(d => !freeDays.includes(d));
    if (studyDays.length === 0) {
      setMessage('Selecione pelo menos um dia disponível para estudar.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Track how many sessions each day already received to spread load evenly
    const dayLoad: Record<string, number> = {};
    studyDays.forEach(d => (dayLoad[d] = 0));

    validSubjects.forEach((sub, subIndex) => {
      let remainingHours = sub.hours;
      // Start from a different day offset per subject to avoid clustering
      let dayOffset = subIndex % studyDays.length;

      while (remainingHours > 0) {
        // Pick the day with least load, starting from dayOffset
        let chosenDay = studyDays[dayOffset % studyDays.length];
        // Find the least-loaded day from dayOffset onward
        let minLoad = Infinity;
        for (let i = 0; i < studyDays.length; i++) {
          const candidate = studyDays[(dayOffset + i) % studyDays.length];
          if (dayLoad[candidate] < minLoad) {
            minLoad = dayLoad[candidate];
            chosenDay = candidate;
          }
        }

        const sessionHours = Math.min(remainingHours, MAX_HOURS_PER_SESSION);
        newTasks.push({
          title: `Estudar ${sub.name} (${sessionHours}h)`,
          day: chosenDay,
          completed: false,
        });
        dayLoad[chosenDay] += sessionHours;
        remainingHours -= sessionHours;
        dayOffset = (studyDays.indexOf(chosenDay) + 1) % studyDays.length;
      }

      // Add a review session on a different day
      const reviewDayIndex = (studyDays.indexOf(newTasks.find(t => t.title.startsWith(`Estudar ${sub.name}`))?.day ?? studyDays[0]) + 2) % studyDays.length;
      newTasks.push({ title: `Revisar ${sub.name}`, day: studyDays[reviewDayIndex], completed: false });
    });

    setSaving(true);
    await addTasks(newTasks);
    setSaving(false);
    setActiveTab('semana');
    setMessage('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Planejamento</h1>
          <p className="text-gray-500">Organize sua semana e crie rotinas eficientes.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress pill */}
          {totalTasks > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {doneTasks}/{totalTasks} concluídas
            </div>
          )}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('semana'); setMessage(''); }}
              className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${activeTab === 'semana' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Semana
            </button>
            <button
              onClick={() => { setActiveTab('rotina'); setMessage(''); }}
              className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${activeTab === 'rotina' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Criar Rotina
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'semana' ? (
        <div className="space-y-6">
          {/* Add task form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            {message && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{message}</div>
            )}
            <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                placeholder="O que você precisa estudar?"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newTaskHours}
                  onChange={e => setNewTaskHours(parseInt(e.target.value) || 1)}
                  className="w-12 bg-transparent focus:outline-none text-center text-sm font-semibold text-gray-700"
                  title="Horas de estudo"
                />
                <span className="text-gray-400 text-sm font-medium">h</span>
              </div>
              <select
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              >
                {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-blue-500/20 text-sm"
                title={newTaskHours > MAX_HOURS_PER_SESSION ? `Será distribuído em ${Math.ceil(newTaskHours / MAX_HOURS_PER_SESSION)} dias` : ''}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Adicionar</>}
              </button>
            </form>
            {newTaskHours > MAX_HOURS_PER_SESSION && (
              <p className="mt-2 text-xs text-blue-500 font-medium">
                ⚡ {newTaskHours}h serão divididas em {Math.ceil(newTaskHours / MAX_HOURS_PER_SESSION)} sessões de até 2h, a partir de <strong>{selectedDay}</strong>.
              </p>
            )}
          </div>

          {/* Day columns */}
          {safeTasks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {DAYS.map(day => {
                  const dayTasks = safeTasks.filter(t => t.day === day);
                  if (dayTasks.length === 0) return null;
                  const c = DAY_COLORS[day];
                  const doneCount = dayTasks.filter(t => t.completed).length;
                  return (
                    <div key={day} className={`rounded-2xl p-4 border-2 ${c.card}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold flex items-center gap-2 ${c.header}`}>
                          <CalendarIcon className={`w-4 h-4 ${c.icon}`} /> {day}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                          {doneCount}/{dayTasks.length}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {dayTasks.map(task => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`group flex items-start gap-3 p-3 rounded-xl bg-white border transition-all cursor-pointer shadow-sm hover:shadow-md ${task.completed ? 'border-gray-100 opacity-70' : 'border-gray-200 hover:border-current'}`}
                          >
                            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? `${c.check} text-white` : 'border-gray-300 text-transparent group-hover:border-gray-400'}`}>
                              <Check className="w-3 h-3" />
                            </div>
                            <span className={`flex-1 text-sm select-none pt-px leading-snug ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                              {task.title}
                            </span>
                            <button
                              onClick={e => { e.stopPropagation(); removeTask(task.id); }}
                              className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg hover:bg-red-50 flex-shrink-0"
                              title="Remover tarefa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delete all button + confirm */}
              <div className="flex justify-end">
                <AnimatePresence mode="wait">
                  {confirmClear ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-red-700">Excluir <strong>todas</strong> as {totalTasks} tarefas?</span>
                      <button
                        onClick={handleClearAll}
                        disabled={clearing}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar'}
                      </button>
                      <button
                        onClick={() => setConfirmClear(false)}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="delete-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setConfirmClear(true)}
                      className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 px-4 py-2.5 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Limpar toda a rotina
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-16 text-gray-400">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Sua semana está vazia.</p>
              <p className="text-sm mt-1">Adicione tarefas acima para começar!</p>
            </div>
          )}
        </div>
      ) : (
        /* Routine generator */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Wand2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerador de Rotina Automático</h2>
              <p className="text-gray-500 text-sm">Adicione suas matérias e o tempo que deseja dedicar. Nós distribuiremos isso na sua semana.</p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium text-sm border border-red-100">{message}</div>
            )}

            <div className="space-y-3 mb-8">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="flex gap-3 items-center">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{index + 1}</div>
                  <input
                    type="text"
                    placeholder="Nome da matéria (ex: Matemática)"
                    value={subject.name}
                    onChange={e => updateSubject(subject.id, 'name', e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subject.hours}
                    onChange={e => updateSubject(subject.id, 'hours', parseInt(e.target.value) || 1)}
                    className="w-20 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center text-sm"
                  />
                  <span className="text-gray-400 font-medium hidden sm:inline text-sm">h</span>
                  <button onClick={() => removeSubject(subject.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Free days selector */}
            <div className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">📅 Dias livres (sem estudo)</p>
              <div className="flex flex-wrap gap-2">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleFreeDay(day)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                      freeDays.includes(day)
                        ? 'bg-red-100 border-red-300 text-red-700 line-through opacity-70'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {freeDays.length > 0 && (
                <p className="mt-2 text-xs text-red-500">
                  {freeDays.join(', ')} {freeDays.length === 1 ? 'não terá' : 'não terão'} sessões de estudo.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={addSubject} className="px-6 py-3 rounded-xl font-medium border-2 border-dashed border-purple-200 text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Adicionar Matéria
              </button>
              <button
                onClick={generateRoutine}
                disabled={saving}
                className="px-8 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2 text-sm"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4" /> Gerar Rotina</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
