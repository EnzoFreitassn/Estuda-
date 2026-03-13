import React from 'react';
import { motion } from 'motion/react';
import { Repeat, MessageSquare, BookOpen, Users, Zap, Moon, Droplets, Dumbbell } from 'lucide-react';

const TECHNIQUES = [
  {
    icon: '🍅',
    title: 'Método Pomodoro',
    desc: 'Alterne entre blocos de foco intenso (25 min) e pausas curtas (5 min). Ideal para evitar fadiga mental.',
    tip: "Use nosso temporizador na aba 'Foco' para aplicar esta técnica.",
    gradient: 'from-orange-500 to-rose-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    icon: '🧠',
    title: 'Active Recall',
    desc: 'Em vez de apenas reler, force seu cérebro a lembrar da informação. Faça perguntas a si mesmo.',
    tip: 'Feche o livro e tente explicar o conceito em voz alta sem olhar para as anotações.',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: '📅',
    title: 'Revisão Espaçada',
    desc: 'Revise o material em intervalos crescentes (1 dia → 3 dias → 1 semana) para fixar na memória de longo prazo.',
    tip: 'Use flashcards ou apps como Anki para automatizar esses intervalos.',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: '🎓',
    title: 'Método Feynman',
    desc: 'Aprenda ensinando. Explique o conceito de forma tão simples que até uma criança entenderia.',
    tip: 'Onde você travar na explicação, é exatamente aí que está sua lacuna de conhecimento.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

const TIPS = [
  { icon: <Zap className="w-5 h-5" />, title: 'Sem Procrastinação', desc: 'Quebre tarefas grandes em passos minúsculos. O mais difícil é começar — os 2 primeiros minutos.', color: 'text-yellow-600 bg-yellow-100' },
  { icon: <Repeat className="w-5 h-5" />, title: 'Consistência', desc: 'Crie um ambiente de estudo fixo e deixe o celular em outro cômodo durante as sessões.', color: 'text-blue-600 bg-blue-100' },
  { icon: <MessageSquare className="w-5 h-5" />, title: 'Escreva à Mão', desc: 'Escrever à mão ativa mais regiões do cérebro do que digitar, melhorando a retenção.', color: 'text-purple-600 bg-purple-100' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Ensine para Fixar', desc: 'Explicar para outra pessoa (ou para você mesmo) é a forma mais eficaz de consolidar o aprendizado.', color: 'text-emerald-600 bg-emerald-100' },
  { icon: <Moon className="w-5 h-5" />, title: 'Sono é Estudo', desc: 'Enquanto você dorme, o cérebro consolida o que aprendeu. 7-8h de sono é inegociável.', color: 'text-indigo-600 bg-indigo-100' },
  { icon: <Droplets className="w-5 h-5" />, title: 'Hidratação', desc: 'Beber água regularmente melhora a concentração. Desidratação leve já reduz a performance cognitiva.', color: 'text-teal-600 bg-teal-100' },
  { icon: <Dumbbell className="w-5 h-5" />, title: 'Exercício Físico', desc: 'Exercícios aumentam o BDNF, proteína que estimula o crescimento de novas conexões neuronais.', color: 'text-rose-600 bg-rose-100' },
  { icon: <Users className="w-5 h-5" />, title: 'Grupos de Estudo', desc: 'Estudar em grupo (com foco) combina revisão, discussão e ensino simultâneos.', color: 'text-orange-600 bg-orange-100' },
];

export default function Learn() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20">
        <div className="relative z-10">
          <p className="text-emerald-200 text-sm font-semibold uppercase tracking-wider mb-1">Ciência do Aprendizado</p>
          <h1 className="text-3xl font-extrabold mb-1">Aprender a Aprender</h1>
          <p className="text-emerald-200 text-sm">Técnicas e dicas baseadas em evidências para otimizar seus estudos.</p>
        </div>
        <div className="absolute -top-6 -right-6 w-36 h-36 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 right-12 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      {/* Techniques */}
      <section>
        <h2 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center gap-2">
          🔬 Técnicas Comprovadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TECHNIQUES.map(t => (
            <motion.div
              key={t.title}
              whileHover={{ y: -3 }}
              className={`bg-white rounded-3xl border-2 ${t.border} shadow-sm overflow-hidden`}
            >
              {/* Gradient top bar */}
              <div className={`bg-gradient-to-r ${t.gradient} px-6 py-4 flex items-center gap-3`}>
                <span className="text-3xl">{t.icon}</span>
                <h3 className="text-white font-bold text-lg">{t.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{t.desc}</p>
                <div className={`${t.bg} border ${t.border} rounded-xl p-3 text-sm`}>
                  <strong className="text-gray-700">💡 Dica prática: </strong>
                  <span className="text-gray-600">{t.tip}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick tips */}
      <section>
        <h2 className="text-xl font-extrabold text-gray-900 mb-5 flex items-center gap-2">
          ⚡ Dicas Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIPS.map(tip => (
            <motion.div
              key={tip.title}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className={`w-10 h-10 ${tip.color} rounded-xl flex items-center justify-center mb-3`}>
                {tip.icon}
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-2">{tip.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
