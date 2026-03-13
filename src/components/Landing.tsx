import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Target, Zap, CheckCircle, ArrowRight, Clock, Star } from 'lucide-react';

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 md:px-16 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Estuda+</span>
        </div>
        <button
          onClick={onStart}
          className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          Entrar <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-32 md:pt-36 md:pb-44">
        {/* BG glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-2xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-semibold mb-8"
        >
          <Star className="w-3.5 h-3.5" /> Plataforma gratuita para estudantes
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
        >
          Organize seus estudos e{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            alcance seus objetivos
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed"
        >
          A plataforma definitiva para estudantes que buscam mais foco, menos procrastinação e resultados extraordinários.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onStart}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="relative z-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-2xl shadow-indigo-500/30 flex items-center gap-2 hover:shadow-indigo-500/50 transition-shadow"
        >
          Começar agora <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex items-center gap-3 mt-8 text-sm text-slate-500"
        >
          <div className="flex -space-x-2">
            {['🧑‍🎓','👩‍💻','🧑‍🔬','👨‍📚','👩‍🎓'].map((e, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-sm">
                {e}
              </div>
            ))}
          </div>
          Já usado por centenas de estudantes
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Por que usar o <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Estuda+</span>?</h2>
            <p className="text-slate-400">Tudo que você precisa para transformar sua rotina acadêmica.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard icon={<Target className="w-7 h-7" />} title="Melhor Foco" desc="Técnica Pomodoro integrada para manter concentração máxima." gradient="from-orange-500 to-rose-500" />
            <FeatureCard icon={<Zap className="w-7 h-7" />} title="Menos Procrastinação" desc="Ferramentas visuais que te ajudam a dar o primeiro passo." gradient="from-violet-500 to-purple-600" />
            <FeatureCard icon={<CheckCircle className="w-7 h-7" />} title="Maior Produtividade" desc="Faça mais em menos tempo com organização inteligente." gradient="from-emerald-500 to-teal-600" />
            <FeatureCard icon={<Clock className="w-7 h-7" />} title="Acompanhamento" desc="Veja seu progresso e mantenha a motivação em alta." gradient="from-blue-500 to-indigo-600" />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-14">Como funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Crie sua conta', desc: 'Cadastro gratuito em segundos. Suas tarefas ficam salvas na nuvem.', emoji: '🚀' },
              { n: '2', title: 'Planeje sua semana', desc: 'Adicione matérias e use o gerador automático de rotinas.', emoji: '📅' },
              { n: '3', title: 'Evolua todo dia', desc: 'Use o Pomodoro, acompanhe seu streak e veja a evolução.', emoji: '📈' },
            ].map(step => (
              <div key={step.n} className="flex flex-col items-center">
                <div className="text-4xl mb-4">{step.emoji}</div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4 shadow-lg shadow-indigo-500/30">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Pronto para começar?</h2>
        <p className="text-blue-200 mb-8 text-lg">Junte-se a estudantes que já transformaram sua rotina.</p>
        <button
          onClick={onStart}
          className="bg-white text-indigo-700 font-bold py-4 px-10 rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          Criar conta grátis <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      <footer className="bg-slate-950 py-8 text-center text-slate-600 text-sm border-t border-white/5">
        © {new Date().getFullYear()} Estuda+. Todos os direitos reservados.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient }: { icon: React.ReactNode; title: string; desc: string; gradient: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-white/5 rounded-3xl p-6">
      <div className={`w-13 h-13 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg w-12 h-12`}>
        {icon}
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
