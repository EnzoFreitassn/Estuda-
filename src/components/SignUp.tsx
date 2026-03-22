import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Loader2, BookOpen, ArrowRight, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SignUp({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
    if (password !== confirm) { setError('As senhas não coincidem.'); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message === 'User already registered'
        ? 'Este e-mail já está cadastrado. Faça login.'
        : 'Erro ao criar conta. Tente novamente.');
    } else if (data.session) {
      // Email confirmation is OFF — user is logged in automatically
      // useAuth hook will detect the session and redirect to app
    } else {
      // Email confirmation is ON — show success screen
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3">Conta criada! 🎉</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Verifique seu e-mail <strong className="text-white">{email}</strong> para confirmar sua conta, depois faça login.
            </p>
            <button onClick={onSwitchToLogin}
              className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              Ir para o Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex md:flex-row">
      {/* Left panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute bottom-10 left-0 w-80 h-80 bg-white/5 rounded-full" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white">Estuda+</span>
        </div>
        <div className="relative z-10">
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-wider mb-3">Comece hoje</p>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Dê o primeiro passo rumo ao seu objetivo.
          </h2>
          <p className="text-purple-200 text-base">Cadastro gratuito. Seus dados ficam seguros e salvos na nuvem.</p>
        </div>
        <div className="relative z-10 flex gap-3">
          {['✅ Gratuito', '☁️ Nuvem', '🔒 Seguro'].map(tag => (
            <span key={tag} className="text-xs font-semibold text-white/70 bg-white/10 px-3 py-1.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white">Estuda+</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-1">Criar conta</h1>
          <p className="text-slate-400 mb-8">Gratuito e sem complicações. Comece agora.</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-rose-500/10 text-rose-400 rounded-2xl text-sm font-medium border border-rose-500/20"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repita a senha"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Criar Conta</span> <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem uma conta?{' '}
            <button onClick={onSwitchToLogin} className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
              Fazer login
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
