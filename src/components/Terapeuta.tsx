import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DailyCheckIn, JournalEntry, UserProfile, TerapeutaAppointment } from '../types';
import { Calendar, UserCheck, Share2, ClipboardList, Plus, Check, Clock, Compass } from 'lucide-react';

interface TerapeutaProps {
  user: UserProfile;
  checkins: DailyCheckIn[];
  entries: JournalEntry[];
  appointments: TerapeutaAppointment[];
  onAddAppointment: (appointment: TerapeutaAppointment) => void;
}

export default function Terapeuta({ user, checkins, entries, appointments, onAddAppointment }: TerapeutaProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [therapistName, setTherapistName] = useState('Dr. Marcus Aurelius (Terapeuta Integrativo)');
  const [notes, setNotes] = useState('');

  const [shareSuccess, setShareSuccess] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    const newAppointment: TerapeutaAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      time,
      therapistName,
      notes,
      status: 'scheduled'
    };

    onAddAppointment(newAppointment);
    setShowAddModal(false);
    setDate('');
    setNotes('');
  };

  const handleShareLogs = () => {
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
    }, 4000);
  };

  const activeAppointments = appointments.filter(a => a.status === 'scheduled');

  return (
    <div id="terapeuta-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Central coordinator action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Export and Share card */}
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1E3F35]">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1E3F35]">Compartilhar Prontuário</h3>
            <p className="text-xs text-[#607062] leading-relaxed">
              Exporte todo o seu histórico de check-ins, flutuações de sintomas, diário emocional e suplementação para enviar em formato estruturado ao seu médico ou terapeuta.
            </p>

            {shareSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] p-2.5 rounded-xl font-medium"
              >
                ✓ Relatório consolidado e criptografado com sucesso! Código gerado para o terapeuta: <strong>TRP-{(checkins.length * 97 + 104)}</strong>
              </motion.div>
            )}
          </div>

          <button
            type="button"
            onClick={handleShareLogs}
            className="w-full mt-6 bg-[#1E3F35] hover:bg-[#152D26] text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Sincronizar Prontuário
          </button>
        </div>

        {/* Calendar scheduling manager */}
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm md:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1E3F35]" />
                <h3 className="font-serif font-bold text-base text-[#1E3F35]">Agenda de Sessões</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-[#1E3F35]/5 hover:bg-[#1E3F35]/10 text-[#1E3F35] text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1 border border-[#1E3F35]/15"
              >
                <Plus className="w-4 h-4" />
                Agendar Sessão
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {activeAppointments.length === 0 ? (
                <div className="text-center py-10 text-[#889B8C] text-xs border border-dashed border-[#E2E2D9] rounded-2xl bg-[#FAFBF9]">
                  Não há consultas marcadas nesta quinzena.
                </div>
              ) : (
                activeAppointments.map(app => (
                  <div key={app.id} className="p-3 bg-[#FAFBF9] border border-[#EBEBE3] rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#1E3F35]">{app.therapistName}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-[#607062]">
                        <span className="font-bold">📅 {app.date.split('-').reverse().join('/')}</span>
                        <span className="font-bold">🕒 {app.time}</span>
                        {app.notes && <span className="italic truncate max-w-xs">{app.notes}</span>}
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded-full">
                      Confirmado
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#FAFBF9] p-4 rounded-2xl border border-[#EBEBE3] mt-4 flex items-start gap-3">
            <ClipboardList className="w-5 h-5 text-[#1E3F35] mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#1E3F35]">Diretrizes de Acompanhamento</span>
              <p className="text-[11px] text-[#607062] leading-relaxed">
                Recomendamos sessões quinzenais de monitoramento para ajuste de fitoterápicos, suplementação nutracêutica e liberação miofascial adaptada.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Booking session modal dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white max-w-md w-full rounded-3xl border border-[#EBEBE3] p-6 space-y-4 shadow-xl"
          >
            <h3 className="font-serif font-bold text-lg text-[#1E3F35]">Agendar Sessão Terapêutica</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Nome do Profissional</label>
                <select
                  value={therapistName}
                  onChange={(e) => setTherapistName(e.target.value)}
                  className="w-full bg-white border border-[#E2E2D9] rounded-xl p-2.5 text-sm"
                >
                  <option value="Dr. Marcus Aurelius (Terapeuta Integrativo)">Dr. Marcus Aurelius (Terapeuta Integrativo)</option>
                  <option value="Dra. Sophia Loren (Psicóloga Somática)">Dra. Sophia Loren (Psicóloga Somática)</option>
                  <option value="Dr. Pedro Almodóvar (Fisioterapeuta Clinico)">Dr. Pedro Almodóvar (Fisioterapeuta Clínico)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Data</label>
                  <input
                    id="appointment-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Horário</label>
                  <input
                    id="appointment-time"
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Notas ou Sintomas Relacionados</label>
                <textarea
                  id="appointment-notes"
                  rows={2}
                  placeholder="Ex: Gostaria de revisar minha dosagem de Magnésio devido a episódios recorrentes de insônia."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  id="submit-appointment"
                  className="flex-1 bg-[#1E3F35] hover:bg-[#152D26] text-white text-xs font-semibold py-3 rounded-xl"
                >
                  Confirmar Sessão
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
