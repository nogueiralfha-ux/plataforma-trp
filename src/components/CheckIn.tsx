import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DailyCheckIn } from '../types';
import { Sparkles, Save, Heart, ShieldAlert, Sun, Eye, Navigation } from 'lucide-react';

interface CheckInProps {
  existingCheckin?: DailyCheckIn;
  onSave: (checkin: DailyCheckIn) => void;
}

export default function CheckIn({ existingCheckin, onSave }: CheckInProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [physical, setPhysical] = useState(existingCheckin?.physical || 3);
  const [emotional, setEmotional] = useState(existingCheckin?.emotional || 3);
  const [spiritual, setSpiritual] = useState(existingCheckin?.spiritual || 3);
  const [sleep, setSleep] = useState(existingCheckin?.sleep || 7);
  const [water, setWater] = useState(existingCheckin?.water || 1000);
  const [steps, setSteps] = useState(existingCheckin?.steps || 4000);
  const [notes, setNotes] = useState(existingCheckin?.notes || '');
  const [showSaved, setShowSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checkin: DailyCheckIn = {
      date: todayStr,
      physical,
      emotional,
      spiritual,
      sleep,
      water,
      steps,
      notes
    };
    onSave(checkin);
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 3000);
  };

  const incrementWater = (amount: number) => {
    setWater(prev => Math.max(0, prev + amount));
  };

  const metricDescriptions = {
    physical: ['Fadiga extrema / Dor', 'Indisposto / Fraco', 'Estável / Normal', 'Disposto / Ativo', 'Vitalidade Máxima'],
    emotional: ['Crise / Ansiedade alta', 'Inquieto / Triste', 'Neutro / Calmo', 'Alegre / Motivado', 'Paz Interior Plena'],
    spiritual: ['Desconectado / Vazio', 'Buscando sentido', 'Equilibrado', 'Conectado / Inspirado', 'Plenitude / Gratidão']
  };

  return (
    <div id="checkin-container" className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#1E3F35]/10 text-[#1E3F35] rounded-full flex items-center justify-center mx-auto mb-3">
          <Sun className="w-6 h-6 text-[#1E3F35]" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1E3F35]">Check-In de Autoavaliação</h2>
        <p className="text-[#607062] text-xs">
          Calibre seus indicadores para monitorar o andamento da sua recuperação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#EBEBE3] p-6 space-y-6 shadow-sm">
        
        {/* Physical Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#607062]">
            <span>1. Estado Físico & Vitalidade</span>
            <span className="text-[#1E3F35] font-bold">{physical}/5</span>
          </div>
          <input
            id="checkin-physical"
            type="range"
            min="1"
            max="5"
            value={physical}
            onChange={(e) => setPhysical(parseInt(e.target.value))}
            className="w-full accent-[#1E3F35] cursor-pointer h-2 bg-[#F5F4EE] rounded-lg appearance-none"
          />
          <div className="text-xs text-[#1E3F35] italic bg-[#F5F4EE] py-2 px-3.5 rounded-xl border border-[#E2E2D9]">
            {metricDescriptions.physical[physical - 1]}
          </div>
        </div>

        {/* Emotional Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#607062]">
            <span>2. Equilíbrio Mental & Emocional</span>
            <span className="text-[#1E3F35] font-bold">{emotional}/5</span>
          </div>
          <input
            id="checkin-emotional"
            type="range"
            min="1"
            max="5"
            value={emotional}
            onChange={(e) => setEmotional(parseInt(e.target.value))}
            className="w-full accent-[#1E3F35] cursor-pointer h-2 bg-[#F5F4EE] rounded-lg appearance-none"
          />
          <div className="text-xs text-[#1E3F35] italic bg-[#F5F4EE] py-2 px-3.5 rounded-xl border border-[#E2E2D9]">
            {metricDescriptions.emotional[emotional - 1]}
          </div>
        </div>

        {/* Spiritual Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#607062]">
            <span>3. Conexão Espiritual & Meditativa</span>
            <span className="text-[#1E3F35] font-bold">{spiritual}/5</span>
          </div>
          <input
            id="checkin-spiritual"
            type="range"
            min="1"
            max="5"
            value={spiritual}
            onChange={(e) => setSpiritual(parseInt(e.target.value))}
            className="w-full accent-[#1E3F35] cursor-pointer h-2 bg-[#F5F4EE] rounded-lg appearance-none"
          />
          <div className="text-xs text-[#1E3F35] italic bg-[#F5F4EE] py-2 px-3.5 rounded-xl border border-[#E2E2D9]">
            {metricDescriptions.spiritual[spiritual - 1]}
          </div>
        </div>

        {/* Sliders for Sleep, Water, Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0F0E9]">
          
          {/* Sleep Hours */}
          <div className="space-y-2">
            <label htmlFor="checkin-sleep" className="block text-xs font-semibold text-[#607062] uppercase tracking-wider">
              Horas de Sono
            </label>
            <div className="flex items-center gap-4 bg-[#F5F4EE] p-3 rounded-xl border border-[#E2E2D9]">
              <input
                id="checkin-sleep"
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-[#1E3F35] cursor-pointer"
              />
              <span className="font-bold text-sm text-[#1E3F35] min-w-14 text-center">{sleep}h</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <label htmlFor="checkin-steps" className="block text-xs font-semibold text-[#607062] uppercase tracking-wider">
              Passos Caminhados
            </label>
            <input
              id="checkin-steps"
              type="number"
              value={steps}
              onChange={(e) => setSteps(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30] font-semibold"
            />
          </div>
        </div>

        {/* Water Intake Section */}
        <div className="space-y-3 bg-[#F5F4EE] p-4 rounded-2xl border border-[#E2E2D9]">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-[#607062] uppercase tracking-wider">Ingestão de Água do Dia</span>
            <span className="text-[#1E3F35] font-bold text-sm">{(water / 1000).toFixed(1)}L / 2.5L</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => incrementWater(250)}
              className="flex-1 bg-white hover:bg-[#EBEBE3] text-xs font-semibold text-[#1E3F35] py-2 rounded-xl transition-all border border-[#E2E2D9]"
            >
              +250ml (Copo)
            </button>
            <button
              type="button"
              onClick={() => incrementWater(500)}
              className="flex-1 bg-white hover:bg-[#EBEBE3] text-xs font-semibold text-[#1E3F35] py-2 rounded-xl transition-all border border-[#E2E2D9]"
            >
              +500ml (Garrafa)
            </button>
            <button
              type="button"
              onClick={() => setWater(0)}
              className="px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2 rounded-xl transition-all border border-red-200"
            >
              Zerar
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="checkin-notes" className="block text-xs font-semibold text-[#607062] uppercase tracking-wider">
            Notas Clínicas e Sintomas Atípicos (Opcional)
          </label>
          <textarea
            id="checkin-notes"
            rows={3}
            placeholder="Como se sentiu hoje? Sentiu alguma dor, palpitação, ou melhora notável?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30] resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {showSaved && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl mb-4 text-center font-medium"
            >
              ✓ Seu check-in diário de hoje ({todayStr}) foi registrado e persistido com sucesso!
            </motion.div>
          )}

          <button
            type="submit"
            id="save-checkin"
            className="w-full bg-[#1E3F35] hover:bg-[#152D26] text-white py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1E3F35]/15 transition-all"
          >
            <Save className="w-5 h-5" />
            Salvar e Persistir Registro
          </button>
        </div>
      </form>
    </div>
  );
}
