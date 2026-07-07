import React from 'react';
import { motion } from 'motion/react';
import { DailyCheckIn } from '../types';
import { Compass, Sparkles, CheckCircle2, Lock, Milestone, ShieldCheck, Flag } from 'lucide-react';

interface JornadaProps {
  checkins: DailyCheckIn[];
}

export default function Jornada({ checkins }: JornadaProps) {
  const checkinCount = checkins.length;

  const phases = [
    {
      id: 1,
      title: 'Fase 1: Desintoxicação & Repouso Profundo',
      daysRequired: '0 - 7 dias',
      description: 'Foco em estabilizar o sono, reduzir a inflamação física inicial, estabelecer a hidratação correta e desintoxicar estímulos digitais agressivos.',
      milestones: ['Completar 3 Check-ins diários', 'Dormir mais de 7 horas por noite', 'Beber no mínimo 2L de água'],
      status: checkinCount < 7 ? 'active' : 'completed'
    },
    {
      id: 2,
      title: 'Fase 2: Reestruturação Cognitiva & Emocional',
      daysRequired: '8 - 21 dias',
      description: 'Início de práticas respiratórias diárias dirigidas, reabilitação física de baixa intensidade e reflexão terapêutica contínua usando o Diário Emocional.',
      milestones: ['Realizar 7 sessões de respiração', 'Registrar pensamentos no diário', 'Identificar gatilhos com ajuda da IA'],
      status: checkinCount >= 7 && checkinCount < 21 ? 'active' : checkinCount >= 21 ? 'completed' : 'locked'
    },
    {
      id: 3,
      title: 'Fase 3: Fortalecimento Integral',
      daysRequired: '22 - 45 dias',
      description: 'Intensificação moderada dos exercícios, consolidação do plano nutricional anti-inflamatório e regulação completa dos ciclos biológicos.',
      milestones: ['Aderência total à suplementação prescrita', 'Atividade física leve constante', 'Redução perceptível de sintomas crônicos'],
      status: checkinCount >= 21 && checkinCount < 45 ? 'active' : checkinCount >= 45 ? 'completed' : 'locked'
    },
    {
      id: 4,
      title: 'Fase 4: Estabilização & Autonomia',
      daysRequired: '46+ dias',
      description: 'Promoção de hábitos consolidados permanentes, vivência espiritual ou meditativa plena e alta capacidade de autorregulação emocional.',
      milestones: ['Manutenção espontânea das rotinas', 'Alinhamento periódico com terapeuta', 'Equilíbrio mental resiliente'],
      status: checkinCount >= 45 ? 'active' : 'locked'
    }
  ];

  const currentPhase = phases.find(p => p.status === 'active') || phases[0];

  return (
    <div id="jornada-container" className="max-w-3xl mx-auto px-4 py-6">
      {/* Header Summary */}
      <div className="bg-[#1E3F35] text-white p-6 rounded-3xl mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] w-40 h-40 bg-white/5 rounded-full blur-xl" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
            <Milestone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold">Sua Trilha de Recuperação</h2>
            <p className="text-white/80 text-xs mt-0.5">
              Você já registrou <span className="font-bold text-emerald-300">{checkinCount}</span> {checkinCount === 1 ? 'dia' : 'dias'} de evolução terapêutica.
            </p>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span>Fase Atual: <strong>{currentPhase.title.split(':')[0]}</strong></span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">
            PROGRESSO LINEAR
          </span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l border-[#EBEBE3] ml-6 pl-8 space-y-12">
        {phases.map((phase) => {
          const isActive = phase.status === 'active';
          const isCompleted = phase.status === 'completed';
          const isLocked = phase.status === 'locked';

          return (
            <div key={phase.id} className="relative">
              {/* Connector Circle Icon */}
              <div className={`absolute left-[-49px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted 
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-600 shadow-md shadow-emerald-600/10' 
                  : isActive 
                    ? 'bg-[#1E3F35] border-[#1E3F35] text-white shadow-md shadow-[#1E3F35]/20 scale-110' 
                    : 'bg-[#F5F4EE] border-[#E2E2D9] text-[#889B8C]'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 fill-emerald-50" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Compass className="w-5 h-5 animate-pulse" />
                )}
              </div>

              {/* Card Container */}
              <div className={`bg-white rounded-2xl border p-5 transition-all ${
                isActive 
                  ? 'border-[#1E3F35] shadow-[0_10px_25px_-5px_rgba(30,63,53,0.05)] bg-[#FAFBF9]' 
                  : 'border-[#EBEBE3] opacity-80'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className={`text-base font-serif font-bold ${isActive ? 'text-[#1E3F35]' : 'text-[#2C3B30]'}`}>
                    {phase.title}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                    isCompleted 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : isActive 
                        ? 'bg-[#1E3F35] text-white border-[#1E3F35]' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {isCompleted ? 'Concluída' : isActive ? 'Em Curso' : 'Bloqueada'}
                  </span>
                </div>

                <p className="text-xs text-[#607062] leading-relaxed mb-4">
                  {phase.description}
                </p>

                {/* Milestones / Checklist */}
                <div className="bg-[#F5F4EE] rounded-xl p-3.5 space-y-2 border border-[#E2E2D9]">
                  <span className="text-[10px] font-bold text-[#607062] uppercase tracking-wider block mb-1">
                    Marcos de Avanço Requeridos:
                  </span>
                  {phase.milestones.map((ms, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#2C3B30]">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#C8D1C9] bg-white'}`}>
                        {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={isCompleted ? 'line-through text-[#889B8C]' : ''}>
                        {ms}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[#889B8C] font-semibold">
                  <Flag className="w-3.5 h-3.5" />
                  <span>Duração estimada: {phase.daysRequired}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
