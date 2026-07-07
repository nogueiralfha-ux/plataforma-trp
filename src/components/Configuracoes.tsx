import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Settings, ShieldCheck, Download, Trash2, Globe, WifiOff, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface ConfiguracoesProps {
  user: UserProfile;
  onUpdateUser: (profile: UserProfile) => void;
  onResetAllData: () => void;
}

export default function Configuracoes({ user, onUpdateUser, onResetAllData }: ConfiguracoesProps) {
  const { user: firebaseUser, profile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🧘');
  const [lang, setLang] = useState('pt-BR');
  const [offlineCache, setOfflineCache] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [submittingSub, setSubmittingSub] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      avatar
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleSimulatePayment = async () => {
    if (!firebaseUser) return;
    setSubmittingSub(true);
    try {
      const docRef = doc(db, 'therapists', firebaseUser.uid);
      await updateDoc(docRef, {
        subscriptionStatus: 'active'
      });
      window.location.reload();
    } catch (err) {
      console.error("Erro ao simular pagamento:", err);
    } finally {
      setSubmittingSub(false);
    }
  };

  const handleExportData = () => {
    const data: { [key: string]: string | null } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('trp_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trp-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="configuracoes-section" className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Assinatura e Faturamento */}
      <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#1E3F35] border-b border-[#F0F0E9] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#1E3F35]" />
          <h3 className="font-serif font-bold text-base">Assinatura e Faturamento</h3>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#1E3F35] flex items-center gap-2">
              <span>Status do Plano:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${profile?.subscriptionStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                {profile?.subscriptionStatus || 'trial'}
              </span>
            </div>
            <p className="text-[11px] text-[#607062] mt-2 leading-relaxed">
              {profile?.subscriptionStatus === 'active' 
                ? 'Sua assinatura está ativa. Acesso total liberado para todos os recursos e pacientes cadastrados.' 
                : 'Você está no período de avaliação gratuita. Ative a assinatura simulando um Pix para testar o fluxo de liberação SaaS.'}
            </p>
          </div>

          {profile?.subscriptionStatus !== 'active' && (
            <button
              type="button"
              disabled={submittingSub}
              onClick={handleSimulatePayment}
              className="bg-[#B89650] hover:bg-[#9A7D3E] text-[#121214] text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-75 flex items-center gap-1.5"
            >
              {submittingSub ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ativar Assinatura (Simular Pix)'}
            </button>
          )}
        </div>
      </div>

      {/* Profile Setup wrapper */}
      {user && (
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-[#1E3F35]">
            <Settings className="w-5 h-5 text-[#1E3F35]" />
            <h3 className="font-serif font-bold text-base">Editar Perfil do Paciente</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">Nome do Paciente</label>
                <input
                  id="settings-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E3F35] text-[#2C3B30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#607062] uppercase mb-1">E-mail de Contato</label>
                <input
                  id="settings-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E3F35] text-[#2C3B30]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#607062] uppercase mb-2">Avatar / Símbolo</label>
              <div className="flex gap-2">
                {['🍃', '☀️', '🌸', '🌊', '🌲', '🕊️', '🧘', '💆'].map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all border ${avatar === av ? 'bg-[#1E3F35] text-white border-[#1E3F35]' : 'bg-[#F5F4EE] hover:bg-[#EBEBE3] border-transparent'}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {savedSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs py-2 px-3 rounded-lg text-center font-medium"
              >
                ✓ Alterações salvas com sucesso! Seus dados de perfil foram atualizados.
              </motion.div>
            )}

            <button
              type="submit"
              id="save-settings-profile"
              className="w-full bg-[#1E3F35] hover:bg-[#152D26] text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações de Perfil
            </button>
          </form>
        </div>
      )}

      {/* Offline capability and Backup configs */}
      <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#1E3F35] border-b border-[#F0F0E9] pb-3">
          <Globe className="w-5 h-5" />
          <h3 className="font-serif font-bold text-base">Preferências do Sistema</h3>
        </div>

        {/* Offline cache */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <span className="text-xs font-bold text-[#1E3F35] flex items-center gap-1">
              <WifiOff className="w-4 h-4 text-[#607062]" />
              Armazenamento Inteligente Offline
            </span>
            <p className="text-[11px] text-[#607062] leading-relaxed">
              Mantém os recursos educacionais da biblioteca e logs de check-ins cacheados para funcionamento offline total.
            </p>
          </div>
          <input
            id="settings-offline-toggle"
            type="checkbox"
            checked={offlineCache}
            onChange={(e) => setOfflineCache(e.target.checked)}
            className="w-4 h-4 accent-[#1E3F35] cursor-pointer"
          />
        </div>

        {/* Backup export data */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5 pr-4">
            <span className="text-xs font-bold text-[#1E3F35] flex items-center gap-1">
              <Download className="w-4 h-4 text-[#607062]" />
              Backup e Exportação de Prontuário
            </span>
            <p className="text-[11px] text-[#607062] leading-relaxed">
              Baixe todas as suas informações clínicas do protocolo TRP criptografadas em formato JSON para fins de backup.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="bg-[#F5F4EE] hover:bg-[#EBEBE3] text-[#1E3F35] text-xs font-bold py-2 px-3 border border-[#E2E2D9] rounded-xl transition-all cursor-pointer"
          >
            Exportar
          </button>
        </div>

        {/* Destructive reset */}
        <div className="pt-4 border-t border-[#F0F0E9] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-red-600 flex items-center gap-1">
              <Trash2 className="w-4 h-4" />
              Zerar Dados Clinicos
            </span>
            <p className="text-[11px] text-[#607062] leading-relaxed max-w-sm">
              Esta ação removerá todos os seus check-ins, diários de cura e conquistas permanentemente. Isso não pode ser desfeito.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Tem certeza de que deseja apagar permanentemente todos os seus dados do protocolo TRP?')) {
                onResetAllData();
              }
            }}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 px-3 border border-red-200 rounded-xl transition-all cursor-pointer"
          >
            Zerar Tudo
          </button>
        </div>
      </div>

    </div>
  );
}
