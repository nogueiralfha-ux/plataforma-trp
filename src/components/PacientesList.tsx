import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, UserCircle, Activity, Calendar, Loader2, X, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

interface Patient {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: string;
  lastSeen?: string;
  createdAt?: any;
}

export default function PacientesList({ onSelectPatient }: { onSelectPatient: (id: string) => void }) {
  const { user: firebaseUser, profile } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Patient Form States
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAvatar, setNewAvatar] = useState('🧘');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const avatars = ['🧘', '🍃', '🌸', '☀️', '🧠', '💧', '🌿', '🦁'];

  const withTimeout = <T,>(promise: Promise<T>, ms: number = 6000): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Tempo de conexão esgotado (Timeout). Verifique se você configurou as suas chaves do Firebase no Render e se o Cloud Firestore está ativado no seu Console do Firebase.")), ms)
      )
    ]);
  };

  const fetchPatients = async () => {
    if (!firebaseUser) return;
    try {
      setLoading(true);
      const q = query(
        collection(db, 'patients'),
        where('therapistId', '==', firebaseUser.uid)
      );
      const querySnapshot = await withTimeout(getDocs(q));
      const list: Patient[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name,
          email: data.email || '',
          avatar: data.avatar || '🧘',
          status: data.status || 'Ativo',
          lastSeen: data.lastSeen || 'Recém criado',
          createdAt: data.createdAt
        });
      });

      // Sort in-memory to avoid needing composite index
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setPatients(list);
    } catch (e: any) {
      console.error("Erro ao buscar pacientes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [firebaseUser]);

  const handleDeletePatient = async (id: string) => {
    if (!window.confirm("Tem certeza de que deseja excluir este paciente e todo o seu prontuário? Esta ação não pode ser desfeita.")) return;
    try {
      setLoading(true);
      await withTimeout(deleteDoc(doc(db, 'patients', id)));
      fetchPatients();
    } catch (e: any) {
      alert("Erro ao excluir paciente: " + (e.message || "Erro de conexão."));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !newName) return;

    setFormSubmitting(true);
    setFormError(null);
    try {
      await withTimeout(
        addDoc(collection(db, 'patients'), {
          therapistId: firebaseUser.uid,
          name: newName,
          email: newEmail,
          avatar: newAvatar,
          status: 'Ativo',
          lastSeen: 'Agora mesmo',
          createdAt: serverTimestamp()
        })
      );
      
      setIsModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewAvatar('🧘');
      fetchPatients();
    } catch (e: any) {
      console.error("Erro ao cadastrar paciente:", e);
      setFormError(e.message || "Erro desconhecido ao salvar no Firestore.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-[#121214] font-bold">Painel do Terapeuta</h1>
        <p className="text-[#889B8C] mt-2">
          Bem-vindo(a), {profile?.name || 'Profissional'}. Gerencie seus pacientes e acompanhe suas jornadas no Protocolo TRP.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#EBEBE3] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-[#889B8C] font-semibold uppercase tracking-wider">Total de Pacientes</p>
            <p className="text-3xl font-bold text-[#1E3F35] mt-1">{patients.length}</p>
          </div>
          <div className="w-12 h-12 bg-[#1E3F35]/10 text-[#1E3F35] rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-[#EBEBE3] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-[#889B8C] font-semibold uppercase tracking-wider">Status do Plano</p>
            <p className="text-3xl font-bold text-[#1E3F35] mt-1 capitalize">{profile?.subscriptionStatus || 'trial'}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1E3F35] p-6 rounded-2xl border border-[#1E3F35] shadow-lg flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm text-white/80 font-semibold uppercase tracking-wider">Novo Paciente</p>
            <p className="text-white text-sm mt-1">Cadastre para iniciar</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative z-10 w-12 h-12 bg-[#B89650] text-[#121214] hover:bg-[#9A7D3E] transition-colors rounded-xl flex items-center justify-center cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBE3] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#EBEBE3]">
          <h2 className="text-lg font-bold text-[#121214]">Seus Pacientes</h2>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#889B8C]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3F35] mb-2" />
            <p>Carregando prontuários...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-[#889B8C]">
            <p className="mb-4">Nenhum paciente cadastrado ainda.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#1E3F35] text-white hover:bg-[#1E3F35]/90 rounded-lg text-sm font-semibold transition-colors"
            >
              Cadastrar Primeiro Paciente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#EBEBE3]">
            {patients.map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-[#F5F4EE] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-[#EBEBE3] rounded-full flex items-center justify-center text-xl shadow-sm">
                    {patient.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#121214]">{patient.name}</h3>
                    <p className="text-sm text-[#889B8C]">{patient.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-[#889B8C] font-semibold uppercase tracking-wider mb-1">Último Acesso</p>
                    <p className="text-sm text-[#2C3B30] flex items-center justify-end gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {patient.lastSeen}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectPatient(patient.id)}
                    className="px-4 py-2 text-sm font-semibold text-[#1E3F35] bg-[#1E3F35]/10 hover:bg-[#1E3F35]/20 rounded-lg transition-colors cursor-pointer"
                  >
                    Abrir Prontuário
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="p-2 text-red-600 hover:bg-red-55/10 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                    title="Excluir Paciente"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Novo Paciente Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#121214]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-950 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-serif text-gray-900 dark:text-white font-bold mb-6">Cadastrar Novo Paciente</h2>
              
              {formError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">
                  {formError}
                </div>
              )}
              
              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="Nome do paciente"
                    className="w-full bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/30 focus:border-[#1E3F35] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">E-mail</label>
                  <input 
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    placeholder="paciente@email.com"
                    className="w-full bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/30 focus:border-[#1E3F35] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#889B8C] uppercase tracking-wider mb-2">Avatar / Ícone</label>
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {avatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setNewAvatar(av)}
                        className={`text-2xl p-2 rounded-xl transition-all border ${newAvatar === av ? 'border-[#1E3F35] bg-[#1E3F35]/10 scale-110' : 'border-transparent hover:bg-[#F5F4EE]'}`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-[#1E3F35] hover:bg-[#2C3B30] text-white py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all mt-4 disabled:opacity-75 cursor-pointer"
                >
                  {formSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cadastrar Paciente'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
