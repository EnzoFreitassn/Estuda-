import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, Flame, Award, TrendingUp, Target } from 'lucide-react';
import { Stats } from '../types';

const QUOTES = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Disciplina é a ponte entre metas e realizações.",
  "Cada hora de estudo é um investimento no seu futuro.",
  "Foco não é dizer sim para o que importa, mas não para o resto.",
];

export default function Dashboard({ stats }: { stats: Stats }) {
  const hours = Math.floor(stats.minutesStudied / 60);
  const minutes = stats.minutesStudied % 60;
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10">
          <p className="text-blue-200 font-semibold text-sm mb-1 uppercase tracking-wider">Bem-vindo de volta 👋</p>
          <h1 className="text-3xl font-extrabold mb-1">Seu Progresso</h1>
          <p className="text-blue-200 text-sm">Acompanhe sua evolução e mantenha a disciplina.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-12 -right-4 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute top-4 right-32 w-16 h-16 bg-white/5 rounded-full" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Tempo de Estudo"
          value={`${hours}h ${minutes}m`}
          sub="Total acumulado"
          gradient="from-blue-500 to-indigo-500"
          bg="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Tarefas Concluídas"
          value={stats.tasksCompleted.toString()}
          sub="Total completas"
          gradient="from-emerald-500 to-teal-500"
          bg="bg-emerald-50"
          textColor="text-emerald-600"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Ofensiva (Streak)"
          value={`${stats.streak} dias`}
          sub="Dias consecutivos"
          gradient="from-orange-500 to-rose-500"
          bg="bg-orange-50"
          textColor="text-orange-600"
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quote */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-7 text-white shadow-lg shadow-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-5 h-5 text-purple-300" />
            <h2 className="text-sm font-bold text-purple-200 uppercase tracking-wider">Motivação do Dia</h2>
          </div>
          <blockquote className="text-lg font-semibold leading-relaxed mb-4">
            "{quote}"
          </blockquote>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-1 rounded-full flex-1 ${i === new Date().getDay() % 4 ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* Weekly challenge */}
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Desafio da Semana</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Complete <strong className="text-orange-600">10 ciclos de Pomodoro</strong> e revise uma matéria que você tem dificuldade esta semana.
          </p>
          <div className="space-y-3">
            <ChallengeBar label="Pomodoros" now={Math.min(10, Math.floor(stats.minutesStudied / 25))} max={10} color="bg-orange-500" />
            <ChallengeBar label="Tarefas" now={Math.min(7, stats.tasksCompleted)} max={7} color="bg-indigo-500" />
          </div>

          {/* Progress tip */}
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <TrendingUp className="w-4 h-4" />
            Baseado nos seus dados de hoje
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, gradient, bg, textColor }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  gradient: string; bg: string; textColor: string;
}) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-2xl font-extrabold ${textColor}`}>{value}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}

function ChallengeBar({ label, now, max, color }: { label: string; now: number; max: number; color: string }) {
  const pct = Math.round((now / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
        <span>{label}</span>
        <span className="text-gray-700">{now}/{max}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
