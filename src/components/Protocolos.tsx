import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Protocol } from '../types';
import { 
  Compass, CheckCircle2, ShieldAlert, Sparkles, 
  Moon, Heart, Droplet, Plus, BookOpen, Volume2, Timer
} from 'lucide-react';

interface ProtocolosProps {
  protocols: Protocol[];
  onToggleProtocol: (id: string, date: string) => void;
  onAddCustomProtocol?: (name: string, description: string, category: any) => void;
}

export default function Protocolos({ protocols, onToggleProtocol, onAddCustomProtocol }: ProtocolosProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customCat, setCustomCat] = useState<'Físico' | 'Mental' | 'Espiritual' | 'Alimentar'>('Mental');

  // Mindfulness Meditation Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [breathState, setBreathState] = useState<'Inale' | 'Segure' | 'Exale'>('Inale');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        // Circular breath pattern simulation (4s inhale, 4s hold, 4s exhale)
        const cycle = (300 - timeLeft) % 12;
        if (cycle < 4) {
          setBreathState('Inale');
        } else if (cycle < 8) {
          setBreathState('Segure');
        } else {
          setBreathState('Exale');
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const categories = ['Todos', 'Físico', 'Mental', 'Espiritual', 'Alimentar'];

  const filteredProtocols = selectedCategory === 'Todos'
    ? protocols
    : protocols.filter(p => p.category === selectedCategory);

  const handleCreateProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customDesc) return;
    if (onAddCustomProtocol) {
      onAddCustomProtocol(customName, customDesc, customCat);
    }
    setCustomName('');
    setCustomDesc('');
    setShowAddModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Alimentar': return <Droplet className="w-4 h-4 text-blue-500" />;
      case 'Físico': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Espiritual': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Mental': return <Compass className="w-4 h-4 text-emerald-500" />;
      default: return <BookOpen className="w-4 h-4 text-[#1E3F35]" />;
    }
  };

  return (
    <div id="protocolos-section" className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      
      {/* Category selector row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EBEBE3] pb-4">
        <div className="flex gap-1 bg-[#F5F4EE] p-1 rounded-xl border border-[#E2E2D9]">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${selectedCategory === cat ? 'bg-white text-[#1E3F35] shadow-sm' : 'text-[#607062] hover:text-[#1E3F35]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-[#1E3F35] hover:bg-[#152D26] text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Adicionar Protocolo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Protocol Checklist List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#1E3F35]">Checklist Diário de Protocolos</h3>
          
          <div className="space-y-3">
            {filteredProtocols.map(p => {
              const isCompletedToday = p.completedDays.includes(todayStr);
              return (
                <div 
                  key={p.id}
                  className={`bg-white rounded-2xl border p-4.5 flex items-start gap-4 transition-all hover:shadow-[0_4px_12px_rgba(30,63,53,0.02)] ${isCompletedToday ? 'border-emerald-200 bg-emerald-50/10' : 'border-[#EBEBE3]'}`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleProtocol(p.id, todayStr)}
                    className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${isCompletedToday ? 'bg-[#1E3F35] border-[#1E3F35] text-white' : 'border-[#C8D1C9] bg-white hover:border-[#1E3F35]'}`}
                  >
                    {isCompletedToday && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(p.category)}
                      <span className="text-[10px] font-bold uppercase text-[#607062] tracking-wider">
                        {p.category}
                      </span>
                      <span className="text-[9px] font-medium bg-[#F5F4EE] px-2 py-0.5 rounded-full border border-[#E2E2D9] text-[#607062] ml-auto">
                        {p.duration}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${isCompletedToday ? 'text-[#1E3F35] line-through opacity-80' : 'text-[#2C3B30]'}`}>
                      {p.name}
                    </h4>
                    <p className="text-xs text-[#607062] mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breathing / Meditation Timer Box */}
        <div className="bg-[#FAFBF9] border border-[#EBEBE3] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="text-center">
            <span className="text-[10px] bg-[#1E3F35]/10 text-[#1E3F35] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block mb-3">
              MIND MEDICINE
            </span>
            <h3 className="font-serif font-bold text-lg text-[#1E3F35] mb-1">Prática Respiratória</h3>
            <p className="text-xs text-[#607062] mb-6">
              Sincronize sua atenção com a expansão pulmonar para desarmar o sistema nervoso simpático.
            </p>

            {/* Glowing Orb animation mimicking breathing cycles */}
            <div className="flex items-center justify-center my-6 h-40">
              <div className="relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={breathState}
                    initial={{ scale: breathState === 'Inale' ? 0.8 : breathState === 'Segure' ? 1.3 : 1.3 }}
                    animate={{ scale: breathState === 'Inale' ? 1.4 : breathState === 'Segure' ? 1.4 : 0.8 }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg pointer-events-none ${
                      breathState === 'Inale' 
                        ? 'bg-[#1E3F35] text-white shadow-[#1E3F35]/25' 
                        : breathState === 'Segure' 
                          ? 'bg-amber-100 text-[#7E5109] border border-amber-300 shadow-amber-300/10' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-widest">{breathState}</span>
                    <span className="text-[9px] opacity-70 mt-1">4 Segundos</span>
                  </motion.div>
                </AnimatePresence>
                {/* Secondary wave ring */}
                <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-[#1E3F35]/20 animate-ping pointer-events-none" />
              </div>
            </div>

            <div className="text-2xl font-mono font-bold text-[#1E3F35] mb-2">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className={`flex-1 text-xs font-semibold py-3 rounded-xl transition-all shadow-sm ${timerActive ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-[#1E3F35] hover:bg-[#152D26] text-white'}`}
            >
              {timerActive ? 'Pausar Ciclo' : 'Iniciar 5 Minutos'}
            </button>
            <button
              type="button"
              onClick={() => { setTimerActive(false); setTimeLeft(300); }}
              className="px-3 bg-white hover:bg-[#EBEBE3] text-[#1E3F35] text-xs font-semibold py-3 rounded-xl border border-[#E2E2D9] transition-all"
            >
              Resetar
            </button>
          </div>
        </div>

      </div>

      {/* Add Custom Protocol Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white max-w-md w-full rounded-3xl border border-[#EBEBE3] p-6 space-y-4 shadow-xl"
          >
            <h3 className="font-serif font-bold text-lg text-[#1E3F35]">Criar Protocolo Sob Medida</h3>
            
            <form onSubmit={handleCreateProtocol} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Nome do Protocolo</label>
                <input
                  id="custom-protocol-name"
                  type="text"
                  required
                  placeholder="Ex: Escalda-pés com sais de Epsom"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3F35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Instruções de Execução</label>
                <textarea
                  id="custom-protocol-desc"
                  rows={2}
                  required
                  placeholder="Ex: Aquecer a água, colocar em uma bacia e relaxar por 15min antes de dormir."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Categoria</label>
                  <select
                    value={customCat}
                    onChange={(e) => setCustomCat(e.target.value as any)}
                    className="w-full bg-white border border-[#E2E2D9] rounded-xl p-2.5 text-sm"
                  >
                    <option value="Físico">Físico</option>
                    <option value="Mental">Mental</option>
                    <option value="Espiritual">Espiritual</option>
                    <option value="Alimentar">Alimentar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Duração</label>
                  <input
                    id="custom-protocol-duration"
                    type="text"
                    defaultValue="15 min"
                    className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl p-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  id="submit-custom-protocol"
                  className="flex-1 bg-[#1E3F35] hover:bg-[#152D26] text-white text-xs font-semibold py-3 rounded-xl"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 bg-[#F5F4EE] hover:bg-[#EBEBE3] text-[#607062] text-xs font-semibold py-3 rounded-xl border border-[#E2E2D9]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
