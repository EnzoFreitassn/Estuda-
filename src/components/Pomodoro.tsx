import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Brain, Zap } from 'lucide-react';
import { Stats } from '../types';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const CIRCUMFERENCE = 2 * Math.PI * 70; // radius = 70

export default function Pomodoro({ stats, updateStats }: { stats: Stats; updateStats: (s: Partial<Stats>) => Promise<void> }) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const total = isBreak ? BREAK_TIME : FOCUS_TIME;
  const progress = (timeLeft / total) * CIRCUMFERENCE;

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        updateStats({
          minutesStudied: statsRef.current.minutesStudied + 25,
          lastStudyDate: new Date().toISOString().split('T')[0],
        });
        setCycles(c => c + 1);
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
      } else {
        setIsBreak(false);
        setTimeLeft(FOCUS_TIME);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, updateStats]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const accent = isBreak
    ? { from: 'from-emerald-500', to: 'to-teal-500', ring: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600', btn: 'bg-gradient-to-br from-emerald-500 to-teal-500' }
    : { from: 'from-orange-500', to: 'to-rose-500', ring: '#f97316', bg: 'bg-orange-50', text: 'text-orange-600', btn: 'bg-gradient-to-br from-orange-500 to-rose-500' };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Foco Profundo</h1>
        <p className="text-gray-500 text-sm">Técnica Pomodoro para máxima produtividade.</p>
      </div>

      {/* Timer card */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 flex flex-col items-center gap-8">
        {/* Mode tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => { setIsBreak(false); setTimeLeft(FOCUS_TIME); setIsActive(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${!isBreak ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Brain className="w-4 h-4" /> Foco
          </button>
          <button
            onClick={() => { setIsBreak(true); setTimeLeft(BREAK_TIME); setIsActive(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isBreak ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Coffee className="w-4 h-4" /> Pausa
          </button>
        </div>

        {/* SVG ring timer */}
        <div className="relative flex items-center justify-center">
          <svg width="180" height="180" className="-rotate-90">
            {/* Track */}
            <circle cx="90" cy="90" r="70" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            {/* Progress */}
            <circle
              cx="90" cy="90" r="70"
              fill="none"
              stroke={accent.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - progress}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-gray-900 font-mono tracking-tighter">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-xs font-semibold mt-1 ${accent.text}`}>
              {isBreak ? 'Descanse!' : 'Foco total'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setIsActive(false); setTimeLeft(isBreak ? BREAK_TIME : FOCUS_TIME); }}
            className="w-14 h-14 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <motion.button
            onClick={() => setIsActive(a => !a)}
            whileTap={{ scale: 0.95 }}
            className={`w-20 h-20 ${accent.btn} text-white rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-105`}
          >
            {isActive ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 ml-1" />}
          </motion.button>
          <div className={`w-14 h-14 ${accent.bg} ${accent.text} rounded-2xl flex flex-col items-center justify-center`}>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold">{cycles}</span>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ciclos hoje', val: cycles, icon: '🔄' },
          { label: 'Min. estudados', val: stats.minutesStudied, icon: '⏱️' },
          { label: 'Streak', val: `${stats.streak}d`, icon: '🔥' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="text-xl font-extrabold text-gray-900">{item.val}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <p className="text-sm text-indigo-700">
          <strong>Dica:</strong> Após 4 ciclos de Pomodoro, faça uma pausa longa de 15-30 minutos para recarregar o cérebro.
        </p>
      </div>
    </div>
  );
}
