import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise } from '../types';
import { 
  Play, Pause, RotateCcw, CheckCircle, ChevronRight, 
  Dumbbell, Compass, Heart, AlertCircle 
} from 'lucide-react';

interface ExerciciosProps {
  exercises: Exercise[];
  onCompleteExercise: (id: string, date: string) => void;
}

export default function Exercicios({ exercises, onCompleteExercise }: ExerciciosProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning && activeExercise) {
      setTimerRunning(false);
      handleFinishExercise();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const selectExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setTimeLeft(ex.duration);
    setTimerRunning(false);
  };

  const handleFinishExercise = () => {
    if (!activeExercise) return;
    onCompleteExercise(activeExercise.id, todayStr);
    setCompletedToday(prev => [...prev, activeExercise.id]);
    setActiveExercise(null);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryTheme = (category: string) => {
    switch(category) {
      case 'Fisioterapia': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' };
      case 'Mobilidade': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
      case 'Meditação': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
      case 'Respiração': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };
    }
  };

  return (
    <div id="exercicios-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Alert guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-[#7E5109] flex-shrink-0" />
        <div className="space-y-1">
          <span className="font-bold">Aviso de Segurança Biológica</span>
          <p className="leading-relaxed">
            Realize os movimentos em ritmo lento e controlado. Caso sinta tontura, dor aguda ou falta de ar profunda, interrompa o cronômetro imediatamente e repouse.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Timer Workspace */}
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 flex flex-col justify-between min-h-[350px] shadow-sm">
          {activeExercise ? (
            <div className="text-center flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-[#1E3F35]/10 text-[#1E3F35] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
                  {activeExercise.category}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1E3F35]">{activeExercise.name}</h3>
                <p className="text-xs text-[#607062] mt-1.5 leading-relaxed max-w-sm mx-auto">
                  {activeExercise.description}
                </p>
              </div>

              {/* Graphical progress ring or line */}
              <div className="my-6">
                <div className="text-5xl font-mono font-bold text-[#1E3F35] tracking-tight mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="w-full bg-[#F5F4EE] h-2 rounded-full overflow-hidden max-w-xs mx-auto border border-[#E2E2D9]">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(timeLeft / activeExercise.duration) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#1E3F35] h-full"
                  />
                </div>
              </div>

              <div className="flex gap-2 max-w-xs mx-auto w-full">
                <button
                  type="button"
                  id="toggle-exercise-timer"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-white ${timerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#1E3F35] hover:bg-[#152D26]'}`}
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {timerRunning ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                  type="button"
                  id="reset-exercise-timer"
                  onClick={() => { setTimerRunning(false); setTimeLeft(activeExercise.duration); }}
                  className="px-3 bg-white hover:bg-[#EBEBE3] border border-[#E2E2D9] rounded-xl text-[#1E3F35] transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  id="force-complete-exercise"
                  onClick={handleFinishExercise}
                  className="px-3 bg-[#E5E9DF] hover:bg-[#D4DDD0] border border-[#1E3F35]/10 rounded-xl text-[#1E3F35] transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 flex-1">
              <div className="w-16 h-16 bg-[#F5F4EE] border border-[#E2E2D9] rounded-full flex items-center justify-center text-[#889B8C] mb-4">
                <Compass className="w-7 h-7" />
              </div>
              <h4 className="font-serif font-bold text-[#1E3F35]">Selecione uma Atividade</h4>
              <p className="text-xs text-[#607062] max-w-xs mx-auto mt-2 leading-relaxed">
                Escolha uma das práticas restaurativas listadas ao lado para iniciar o temporizador com as orientações integradas.
              </p>
            </div>
          )}
        </div>

        {/* Exercises Directory */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#1E3F35]">Guia de Práticas Disponíveis</h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {exercises.map((ex) => {
              const isCompletedToday = ex.completedHistory.includes(todayStr) || completedToday.includes(ex.id);
              const theme = getCategoryTheme(ex.category);

              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => selectExercise(ex)}
                  className={`w-full text-left bg-white p-4 rounded-2xl border transition-all flex items-center justify-between hover:border-[#1E3F35] ${activeExercise?.id === ex.id ? 'ring-2 ring-[#1E3F35] border-[#1E3F35]' : 'border-[#EBEBE3]'}`}
                >
                  <div className="space-y-1 pr-4 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${theme.bg} ${theme.text} border ${theme.border}`}>
                        {ex.category}
                      </span>
                      <span className="text-[9px] text-[#889B8C] font-semibold">
                        {Math.floor(ex.duration / 60)} min
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#2C3B30]">{ex.name}</h4>
                    <p className="text-xs text-[#607062] line-clamp-1 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 pl-2">
                    {isCompletedToday ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#F5F4EE] border border-[#E2E2D9] flex items-center justify-center text-[#1E3F35] hover:bg-[#1E3F35] hover:text-white transition-all">
                        <Play className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
