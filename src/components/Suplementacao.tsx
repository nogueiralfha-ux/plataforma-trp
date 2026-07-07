import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Supplement } from '../types';
import { CheckCircle, AlertCircle, Plus, Calendar, Pill, Clock, Compass } from 'lucide-react';

interface SuplementacaoProps {
  supplements: Supplement[];
  onToggleSupplement: (id: string, date: string) => void;
  onAddSupplement?: (name: string, dosage: string, time: string, days: number[]) => void;
}

export default function Suplementacao({ supplements, onToggleSupplement, onAddSupplement }: SuplementacaoProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDay = new Date().getDay();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1,2,3,4,5,6,0]); // All days by default

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;
    if (onAddSupplement) {
      onAddSupplement(name, dosage, time, selectedDays);
    }
    setName('');
    setDosage('');
    setShowAddModal(false);
  };

  const toggleDay = (dayNum: number) => {
    setSelectedDays(prev => 
      prev.includes(dayNum)
        ? prev.filter(d => d !== dayNum)
        : [...prev, dayNum]
    );
  };

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Categorize by period (morning: 05:00 - 11:59, afternoon: 12:00 - 17:59, night: 18:00 - 04:59)
  const getPeriod = (timeStr: string) => {
    const hour = parseInt(timeStr.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
  };

  const sortedSupplements = [...supplements].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div id="suplementacao-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Alert guidelines */}
      <div className="bg-[#FAFBF9] border border-[#EBEBE3] rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-3 text-xs text-[#2C3B30]">
          <Pill className="w-5 h-5 text-[#1E3F35] flex-shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#1E3F35]">Suplementação Baseada em Ciência</span>
            <p className="text-[#607062] leading-relaxed">
              Consuma os compostos nos horários corretos para otimizar a assimilação celular (magnésio à noite para relaxamento, ubiquinol pela manhã para energia).
            </p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-[#1E3F35] hover:bg-[#152D26] text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1 shrink-0 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Nutracêutico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Supplements Schedules columns */}
        {['Manhã', 'Tarde', 'Noite'].map((period) => {
          const periodSupps = sortedSupplements.filter(s => {
            const isToday = s.daysOfWeek.includes(todayDay);
            return isToday && getPeriod(s.time) === period;
          });

          return (
            <div key={period} className="bg-white rounded-3xl border border-[#EBEBE3] p-5 space-y-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between border-b border-[#F0F0E9] pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1E3F35]" />
                  <h4 className="font-serif font-bold text-sm text-[#1E3F35]">Turno da {period}</h4>
                </div>
                <span className="text-[10px] bg-[#1E3F35]/5 text-[#1E3F35] px-2 py-0.5 rounded-full font-bold">
                  {periodSupps.filter(s => s.completedHistory[todayStr]).length}/{periodSupps.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px]">
                {periodSupps.length === 0 ? (
                  <div className="text-center py-8 text-[#889B8C] text-xs">
                    Sem suplementos prescritos.
                  </div>
                ) : (
                  periodSupps.map((s) => {
                    const taken = s.completedHistory[todayStr] || false;

                    return (
                      <div 
                        key={s.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${taken ? 'bg-emerald-50/15 border-emerald-200' : 'bg-[#FAFBF9] border-[#EBEBE3] hover:border-[#1E3F35]'}`}
                      >
                        <div className="space-y-0.5">
                          <h5 className={`text-xs font-bold ${taken ? 'text-[#1E3F35] line-through opacity-70' : 'text-[#2C3B30]'}`}>
                            {s.name}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-[#607062]">
                            <span className="font-medium bg-[#F5F4EE] px-1.5 py-0.2 rounded border border-[#E2E2D9]">
                              {s.dosage}
                            </span>
                            <span className="font-bold flex items-center gap-0.5">
                              🕒 {s.time}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleSupplement(s.id, todayStr)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${taken ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#C8D1C9] bg-white hover:border-[#1E3F35]'}`}
                        >
                          {taken && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* Add Custom Supplement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white max-w-md w-full rounded-3xl border border-[#EBEBE3] p-6 space-y-4 shadow-xl"
          >
            <h3 className="font-serif font-bold text-lg text-[#1E3F35]">Cadastrar Suplemento</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Nome do Composto</label>
                <input
                  id="supplement-name"
                  type="text"
                  required
                  placeholder="Ex: Ubiquinol (Coenzima Q10)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Dosagem</label>
                  <input
                    id="supplement-dosage"
                    type="text"
                    required
                    placeholder="Ex: 100 mg (1 caps)"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Horário</label>
                  <input
                    id="supplement-time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-2">Dias de Uso</label>
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((d, index) => {
                    const isSelected = selectedDays.includes(index);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`py-2 text-center text-xs font-semibold rounded-lg border transition-all ${isSelected ? 'bg-[#1E3F35] border-[#1E3F35] text-white' : 'bg-white border-[#E2E2D9] text-[#607062] hover:bg-[#F5F4EE]'}`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  id="submit-custom-supplement"
                  className="flex-1 bg-[#1E3F35] hover:bg-[#152D26] text-white text-xs font-semibold py-3 rounded-xl"
                >
                  Salvar Suplemento
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
