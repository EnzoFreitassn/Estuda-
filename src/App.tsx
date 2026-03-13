import React, { useState } from 'react';
import { Home as HomeIcon, Calendar, Clock, BookMarked, LogOut, UserCircle, ChevronRight } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';

import Landing from './components/Landing';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Pomodoro from './components/Pomodoro';
import Learn from './components/Learn';
import ProfilePage from './components/Profile';
import { Loader2 } from 'lucide-react';

type Tab = 'dashboard' | 'planner' | 'pomodoro' | 'learn' | 'profile';
type AuthScreen = 'login' | 'signup';

const NAV_ITEMS = [
  { id: 'dashboard' as Tab, label: 'Painel',      icon: HomeIcon,     color: 'from-blue-500 to-indigo-500' },
  { id: 'planner'   as Tab, label: 'Planejador',  icon: Calendar,     color: 'from-violet-500 to-purple-500' },
  { id: 'pomodoro'  as Tab, label: 'Foco',        icon: Clock,        color: 'from-orange-500 to-rose-500' },
  { id: 'learn'     as Tab, label: 'Aprender',    icon: BookMarked,   color: 'from-emerald-500 to-teal-500' },
  { id: 'profile'   as Tab, label: 'Perfil',      icon: UserCircle,   color: 'from-pink-500 to-fuchsia-500' },
];

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showApp, setShowApp] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const { tasks, stats, loading: dataLoading, addTask, addTasks, toggleTask, removeTask, clearAllTasks, updateStats } = useSupabaseData(user?.id);

  if (authLoading) return <Spinner />;

  if (!user) {
    if (!showApp) return <Landing onStart={() => setShowApp(true)} />;
    if (authScreen === 'signup') return <SignUp onSwitchToLogin={() => setAuthScreen('login')} />;
    return <Login onSwitchToSignUp={() => setAuthScreen('signup')} />;
  }

  if (dataLoading) return <Spinner />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'planner':   return <Planner tasks={tasks} addTask={addTask} addTasks={addTasks} toggleTask={toggleTask} removeTask={removeTask} clearAllTasks={clearAllTasks} stats={stats} updateStats={updateStats} />;
      case 'pomodoro':  return <Pomodoro stats={stats} updateStats={updateStats} />;
      case 'learn':     return <Learn />;
      case 'profile':   return <ProfilePage userId={user.id} userEmail={user.email ?? ''} />;
      default:          return <Dashboard stats={stats} />;
    }
  };

  const initials = (user.email ?? 'U').slice(0, 2).toUpperCase();
  const activeItem = NAV_ITEMS.find(n => n.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 fixed h-full z-10 shadow-2xl">
        {/* Brand */}
        <button
          onClick={() => { setShowApp(false); signOut(); }}
          className="p-6 flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">Estuda+</span>
        </button>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                  isActive
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-lg`
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`font-semibold text-sm flex-1 text-left ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 mb-1">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeItem?.color ?? 'from-blue-500 to-indigo-500'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{user.email?.split('@')[0]}</p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 p-5 md:p-8 pb-28 md:pb-10 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* ── Bottom Nav (Mobile) ── */}
      <nav className="md:hidden fixed bottom-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-white/10 flex justify-around p-2 z-20">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive ? 'text-white' : 'text-slate-500'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isActive ? `bg-gradient-to-br ${item.color}` : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-semibold">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={signOut}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-slate-500"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-semibold">Sair</span>
        </button>
      </nav>
    </div>
  );
}

function Spinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
          <BookMarked className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    </div>
  );
}
