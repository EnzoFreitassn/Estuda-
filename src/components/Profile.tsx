import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Edit3, Save, Loader2, Check, KeyRound, Target, Smile, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  full_name: string;
  username: string;
  bio: string;
  study_goal: string;
  avatar_emoji: string;
}

const EMOJIS = ['🎓', '📚', '🧠', '⚡', '🔥', '🌟', '🦁', '🐉', '🚀', '🎯', '💡', '🏆'];

const GRADIENT_OPTIONS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-rose-500',
  'from-pink-500 to-fuchsia-600',
  'from-amber-500 to-orange-600',
];

export default function ProfilePage({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [profile, setProfile] = useState<Profile>({ full_name: '', username: '', bio: '', study_goal: '', avatar_emoji: '🎓' });
  const [gradientIdx, setGradientIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  const [showPwForm, setShowPwForm] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
      if (data) {
        setProfile({ full_name: data.full_name || '', username: data.username || '', bio: data.bio || '', study_goal: data.study_goal || '', avatar_emoji: data.avatar_emoji || '🎓' });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').upsert({ user_id: userId, ...profile, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 6) { setPwError('A senha deve ter pelo menos 6 caracteres.'); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) { setPwError('Erro ao alterar senha.'); return; }
    setPwSaved(true);
    setNewPw('');
    setTimeout(() => { setPwSaved(false); setShowPwForm(false); }, 2500);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  const gradient = GRADIENT_OPTIONS[gradientIdx];
  const initials = (profile.full_name || userEmail).slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-fuchsia-500/20">
        <div className="relative z-10">
          <p className="text-pink-200 text-sm font-semibold uppercase tracking-wider mb-1">Conta</p>
          <h1 className="text-3xl font-extrabold">Meu Perfil</h1>
          <p className="text-pink-200 text-sm mt-1">Personalize sua conta e metas de estudo.</p>
        </div>
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 right-12 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      {/* Avatar + info card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Avatar banner */}
        <div className={`bg-gradient-to-r ${gradient} p-8 flex flex-col items-center gap-4`}>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl border-4 border-white/30 shadow-xl select-none">
            {profile.avatar_emoji}
          </div>
          <div className="text-center">
            <p className="text-white font-extrabold text-xl">{profile.full_name || profile.username || 'Estudante'}</p>
            <p className="text-white/70 text-sm">{userEmail}</p>
          </div>

          {editing && (
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setProfile(p => ({ ...p, avatar_emoji: e }))}
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/20 hover:bg-white/30 ${profile.avatar_emoji === e ? 'ring-2 ring-white scale-110' : ''}`}>
                  {e}
                </button>
              ))}
              {/* Gradient picker */}
              <div className="w-full flex justify-center gap-2 mt-1">
                {GRADIENT_OPTIONS.map((g, i) => (
                  <button key={i} onClick={() => setGradientIdx(i)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} transition-all ${gradientIdx === i ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110' : 'opacity-70 hover:opacity-100'}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="p-7 space-y-5">
          <Field icon={<User className="w-4 h-4" />} label="Nome completo" value={profile.full_name} placeholder="Seu nome" editing={editing} onChange={v => setProfile(p => ({ ...p, full_name: v }))} accent="focus:ring-fuchsia-500" />
          <Field icon={<Smile className="w-4 h-4" />} label="Apelido" value={profile.username} placeholder="Como quer ser chamado?" editing={editing} onChange={v => setProfile(p => ({ ...p, username: v }))} accent="focus:ring-fuchsia-500" />
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">E-mail</label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{userEmail}</span>
            </div>
          </div>
          <Field icon={<Target className="w-4 h-4" />} label="Meta de estudos" value={profile.study_goal} placeholder="Ex: Passar no vestibular" editing={editing} onChange={v => setProfile(p => ({ ...p, study_goal: v }))} accent="focus:ring-fuchsia-500" />
          <Field icon={<Edit3 className="w-4 h-4" />} label="Bio" value={profile.bio} placeholder="Conte um pouco sobre você..." editing={editing} multiline onChange={v => setProfile(p => ({ ...p, bio: v }))} accent="focus:ring-fuchsia-500" />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving}
                  className={`flex-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2`}>
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar</>}
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm">
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex-1 bg-gray-900 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                <Edit3 className="w-4 h-4" /> Editar Perfil
              </button>
            )}
          </div>

          {saved && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2 border border-emerald-100">
              <Check className="w-4 h-4" /> Perfil salvo com sucesso!
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Change password */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-sm">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Alterar Senha</h2>
        </div>

        {!showPwForm ? (
          <button onClick={() => setShowPwForm(true)}
            className="px-5 py-2.5 border-2 border-dashed border-orange-200 text-orange-600 hover:border-orange-400 hover:bg-orange-50 rounded-xl font-medium transition-all text-sm">
            Trocar senha
          </button>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwError && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100">{pwError}</div>}
            {pwSaved && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2 border border-emerald-100">
                <Check className="w-4 h-4" /> Senha alterada!
              </motion.div>
            )}
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Nova senha (mín. 6 caracteres)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all text-sm" />
            <div className="flex gap-3">
              <button type="submit" disabled={pwLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar nova senha'}
              </button>
              <button type="button" onClick={() => { setShowPwForm(false); setPwError(''); setNewPw(''); }}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function Field({ icon, label, value, placeholder, editing, multiline, onChange, accent }: {
  icon: React.ReactNode; label: string; value: string; placeholder: string;
  editing: boolean; multiline?: boolean; onChange: (v: string) => void; accent: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      {editing ? (
        multiline ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${accent} transition-all resize-none text-sm`} />
        ) : (
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
            <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${accent} transition-all text-sm`} />
          </div>
        )
      ) : (
        <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 min-h-[46px]">
          <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
          <span className={`text-sm ${value ? 'text-gray-800' : 'text-gray-400 italic'}`}>{value || placeholder}</span>
        </div>
      )}
    </div>
  );
}
