import React from 'react';
import { motion } from 'motion/react';
import { DailyCheckIn, Protocol, Supplement, Achievement, UserProfile } from '../types';
import { 
  Flame, Droplets, Footprints, Moon, Compass, CheckCircle2, 
  ArrowUpRight, AlertCircle, Award, Sparkles, BookOpen
} from 'lucide-react';

interface HomeDashboardProps {
  user: UserProfile;
  checkins: DailyCheckIn[];
  protocols: Protocol[];
  supplements: Supplement[];
  achievements: Achievement[];
  onNavigate: (section: string) => void;
}

export default function HomeDashboard({ 
  user, 
  checkins, 
  protocols, 
  supplements, 
  achievements, 
  onNavigate 
}: HomeDashboardProps) {
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckin = checkins.find(c => c.date === todayStr);

  // Compute protocol completion today
  const activeProtocols = protocols.filter(p => p.isActive);
  const completedProtocolsCount = activeProtocols.filter(p => p.completedDays.includes(todayStr)).length;
  const protocolPercentage = activeProtocols.length > 0 
    ? Math.round((completedProtocolsCount / activeProtocols.length) * 100) 
    : 0;

  // Compute supplement completion today
  const todayDay = new Date().getDay();
  const activeSupplements = supplements.filter(s => s.daysOfWeek.includes(todayDay));
  const completedSupplementsCount = activeSupplements.filter(s => s.completedHistory[todayStr]).length;
  const supplementsPercentage = activeSupplements.length > 0
    ? Math.round((completedSupplementsCount / activeSupplements.length) * 100)
    : 0;

  // Streak calculation (consecutive days of checkins)
  const calculateStreak = () => {
    let streak = 0;
    const sortedDates = [...checkins]
      .map(c => c.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let current = new Date();
    current.setHours(0,0,0,0);
    
    // Check if user has checked in today or yesterday to continue streak
    const hasToday = sortedDates.includes(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() - 1);
    const hasYesterday = sortedDates.includes(current.toISOString().split('T')[0]);

    if (!hasToday && !hasYesterday) return 0;

    let indexDate = hasToday ? new Date() : current;
    indexDate.setHours(0,0,0,0);

    while (true) {
      const dateStr = indexDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        streak++;
        indexDate.setDate(indexDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Mood color helper
  const getMoodEmoji = (mood?: string) => {
    switch(mood) {
      case 'joy': return '☀️ Alegre';
      case 'neutral': return '🍃 Sereno';
      case 'sad': return '🌧️ Triste';
      case 'anxious': return '🌪️ Ansioso';
      case 'angry': return '🔥 Irritado';
      case 'tired': return '🔋 Cansado';
      default: return 'Sem dados';
    }
  };

  return (
    <div id="dashboard" className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EBEBE3] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-4xl w-14 h-14 bg-[#F5F4EE] rounded-2xl flex items-center justify-center border border-[#E2E2D9]">
            {user.avatar || '🧘'}
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1E3F35]">Olá, {user.name}</h2>
            <p className="text-[#607062] text-xs">
              Bem-vindo ao seu refúgio de autocuidado. Hoje é um novo passo na sua jornada.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#F5F4EE] px-4 py-2.5 rounded-2xl border border-[#E2E2D9] self-start md:self-auto">
          <Flame className="w-5 h-5 text-[#E67E22] fill-[#E67E22]/10" />
          <div className="text-left">
            <div className="text-xs text-[#607062] font-medium leading-none">Sua Sequência</div>
            <div className="text-sm font-bold text-[#1E3F35]">{currentStreak} {currentStreak === 1 ? 'Dia' : 'Dias'} Seguidos</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Overview & Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ring 1: Protocolos */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBE3] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-semibold text-[#607062] uppercase tracking-wider block">Protocolo TRP</span>
              <h3 className="text-lg font-serif font-bold text-[#1E3F35]">Tarefas Diárias</h3>
            </div>
            <span className="bg-[#1E3F35]/5 text-[#1E3F35] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#1E3F35]/10">
              {completedProtocolsCount}/{activeProtocols.length}
            </span>
          </div>

          <div className="flex items-center justify-center py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#F5F4EE" strokeWidth="10" fill="none" />
                <circle cx="72" cy="72" r="60" stroke="#1E3F35" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - protocolPercentage / 100)}
                  strokeLinecap="round" className="transition-all duration-700 ease-out" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold text-[#1E3F35]">{protocolPercentage}%</span>
                <p className="text-[10px] text-[#607062] font-semibold uppercase">Concluído</p>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => onNavigate('protocolos')}
            className="w-full mt-2 bg-[#F5F4EE] hover:bg-[#EBEBE3] text-[#1E3F35] text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#E2E2D9]"
          >
            Visualizar Protocolos
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ring 2: Suplementos */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBE3] flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-semibold text-[#607062] uppercase tracking-wider block">Nutracêuticos</span>
              <h3 className="text-lg font-serif font-bold text-[#1E3F35]">Suplementação</h3>
            </div>
            <span className="bg-[#8E44AD]/5 text-[#8E44AD] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#8E44AD]/10">
              {completedSupplementsCount}/{activeSupplements.length}
            </span>
          </div>

          <div className="flex items-center justify-center py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#F5F4EE" strokeWidth="10" fill="none" />
                <circle cx="72" cy="72" r="60" stroke="#8E44AD" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - supplementsPercentage / 100)}
                  strokeLinecap="round" className="transition-all duration-700 ease-out" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold text-[#8E44AD]">{supplementsPercentage}%</span>
                <p className="text-[10px] text-[#607062] font-semibold uppercase">Tomados</p>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => onNavigate('suplementacao')}
            className="w-full mt-2 bg-[#F5F4EE] hover:bg-[#EBEBE3] text-[#8E44AD] text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#E2E2D9]"
          >
            Ver Agenda
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Center Card */}
        <div className="bg-[#1E3F35] text-white p-6 rounded-3xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-20%] w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          
          <div>
            <span className="text-[10px] bg-white/10 text-white/90 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider inline-block mb-3">
              Rotina Saudável
            </span>
            <h3 className="text-xl font-serif font-bold mb-2">Check-In de Hoje</h3>
            <p className="text-white/80 text-xs leading-relaxed mb-4">
              {todayCheckin 
                ? 'Seu check-in diário foi concluído com sucesso! Seus marcadores biológicos já foram atualizados.'
                : 'Registre seu estado físico, emocional, sono e hidratação de hoje para monitorar sua recuperação no gráfico.'}
            </p>
          </div>

          {todayCheckin ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs bg-white/10 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Check-in realizado</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-white/90">
                <div>Energia: {todayCheckin.physical}/5</div>
                <div>Humor: {todayCheckin.emotional}/5</div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              id="goto-checkin"
              onClick={() => onNavigate('checkin')}
              className="w-full bg-[#E5E9DF] hover:bg-[#D4DDD0] text-[#1E3F35] py-3 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              Fazer Avaliação Diária
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Widgets Rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sleep Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#EBEBE3] flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-[#607062] font-semibold uppercase tracking-wider">Sono</div>
            <div className="text-sm font-bold text-[#1E3F35]">
              {todayCheckin ? `${todayCheckin.sleep} Horas` : 'Sem dados'}
            </div>
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#EBEBE3] flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-[#607062] font-semibold uppercase tracking-wider">Água</div>
            <div className="text-sm font-bold text-[#1E3F35]">
              {todayCheckin ? `${todayCheckin.water} ml` : '0 ml'}
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#EBEBE3] flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-[#607062] font-semibold uppercase tracking-wider">Passos</div>
            <div className="text-sm font-bold text-[#1E3F35]">
              {todayCheckin ? `${todayCheckin.steps.toLocaleString()} / 8k` : '0 / 8k'}
            </div>
          </div>
        </div>

        {/* Mood Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#EBEBE3] flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-[#607062] font-semibold uppercase tracking-wider">Humor Médio</div>
            <div className="text-sm font-bold text-[#1E3F35]">
              {todayCheckin ? getMoodEmoji(todayCheckin.emotional >= 4 ? 'joy' : todayCheckin.emotional >= 3 ? 'neutral' : 'tired') : 'Não avaliado'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Menu / Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Group / Therapist info shortcut */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBE3] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1E3F35]" />
              <h4 className="font-serif font-bold text-[#1E3F35]">Assistente Terapêutico IA</h4>
            </div>
            <span className="text-[10px] font-semibold bg-[#1E3F35]/10 text-[#1E3F35] px-2 py-0.5 rounded-full">ATIVO</span>
          </div>
          <p className="text-xs text-[#607062] leading-relaxed mb-4">
            Nosso assistente cognitivo analisará seu progresso do dia, sintomas e objetivos para sugerir práticas de meditação e calmantes customizados.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate('ia')}
              className="flex-1 bg-[#1E3F35] hover:bg-[#152D26] text-white text-xs font-semibold py-3 rounded-xl transition-all"
            >
              Conversar com a IA
            </button>
            <button
              type="button"
              onClick={() => onNavigate('diario')}
              className="flex-1 bg-[#F5F4EE] hover:bg-[#EBEBE3] text-[#1E3F35] text-xs font-semibold py-3 rounded-xl border border-[#E2E2D9] transition-all"
            >
              Ver Diário Emocional
            </button>
          </div>
        </div>

        {/* Achievements / Conquistas Summary */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBEBE3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h4 className="font-serif font-bold text-[#1E3F35]">Suas Conquistas</h4>
            </div>
            <button 
              type="button" 
              onClick={() => onNavigate('conquistas')}
              className="text-[#1E3F35] text-xs font-semibold flex items-center hover:underline"
            >
              Ver Todas
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 my-2">
            {achievements.slice(0, 3).map((ach, idx) => (
              <div 
                key={ach.id} 
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${ach.unlockedAt ? 'bg-[#FAF9F5] border-[#EBEBE3]' : 'bg-[#FAFAFA] border-dashed border-[#E2E2D9] opacity-50'}`}
              >
                <span className="text-2xl mb-1">{ach.icon}</span>
                <span className="text-[10px] font-bold text-[#1E3F35] truncate w-full">{ach.title}</span>
                <span className="text-[8px] text-[#607062]">{ach.unlockedAt ? 'Desbloqueada' : 'Bloqueada'}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-[#607062] flex items-center gap-1.5 mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#1E3F35]" />
            <span>Complete check-ins e suplementos diariamente para destravar troféus de cura!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
