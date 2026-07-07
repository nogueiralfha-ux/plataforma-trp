import React from 'react';
import { motion } from 'motion/react';
import { Achievement, DailyCheckIn } from '../types';
import { Award, ShieldCheck, Flame, Zap, Trophy, Compass } from 'lucide-react';

interface ConquistasProps {
  achievements: Achievement[];
  checkins: DailyCheckIn[];
}

export default function Conquistas({ achievements, checkins }: ConquistasProps) {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const percentage = Math.round((unlockedCount / achievements.length) * 100) || 0;

  return (
    <div id="conquistas-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Overview Ring card banner */}
      <div className="bg-[#1E3F35] text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold">Galeria de Troféus de Cura</h2>
            <p className="text-white/80 text-xs mt-0.5">
              Você completou <span className="font-bold text-emerald-300">{unlockedCount} de {achievements.length}</span> conquistas do protocolo TRP.
            </p>
          </div>
        </div>

        {/* Progress Bar metric display */}
        <div className="w-full md:max-w-xs relative z-10 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Progresso da Jornada</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              className="bg-amber-400 h-full"
            />
          </div>
        </div>
      </div>

      {/* Grid of trophies cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((ach) => {
          const unlocked = !!ach.unlockedAt;

          return (
            <div 
              key={ach.id}
              className={`bg-white rounded-3xl border p-5 flex flex-col justify-between text-center transition-all ${
                unlocked 
                  ? 'border-amber-200 bg-[#FAFBF9] shadow-sm' 
                  : 'border-[#EBEBE3] opacity-60 bg-gray-50/50'
              }`}
            >
              <div className="space-y-3 py-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mx-auto border transition-all ${
                  unlocked 
                    ? 'bg-amber-50 border-amber-200 shadow-md scale-105' 
                    : 'bg-[#F5F4EE] border-[#E2E2D9]'
                }`}>
                  {unlocked ? ach.icon : '🔒'}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#1E3F35] leading-tight truncate px-1">
                    {ach.title}
                  </h4>
                  <p className="text-[10px] text-[#607062] leading-relaxed px-2">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F0E9]">
                {unlocked ? (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 py-1 px-2.5 rounded-full inline-block">
                    ✓ Desbloqueada
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-gray-500 bg-gray-100 border border-gray-200 py-1 px-2.5 rounded-full inline-block">
                    Bloqueada
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
