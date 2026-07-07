import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ShieldCheck, Users, Trash2, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Therapist {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: 'trial' | 'active' | 'inactive';
  createdAt?: any;
}

export default function AdminDashboard() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'therapists'));
      const list: Therapist[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name || 'Sem nome',
          email: data.email || 'Sem e-mail',
          subscriptionStatus: data.subscriptionStatus || 'trial',
          createdAt: data.createdAt
        });
      });
      setTherapists(list);
    } catch (err) {
      console.error("Erro ao carregar terapeutas no admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'trial' | 'active' | 'inactive') => {
    setUpdatingId(id);
    try {
      const docRef = doc(db, 'therapists', id);
      await updateDoc(docRef, { subscriptionStatus: newStatus });
      setTherapists(prev => prev.map(t => t.id === id ? { ...t, subscriptionStatus: newStatus } : t));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteTherapist = async (id: string) => {
    if (!confirm("Tem certeza de que deseja excluir permanentemente este profissional e todo o acesso dele?")) return;
    setUpdatingId(id);
    try {
      await deleteDoc(doc(db, 'therapists', id));
      setTherapists(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erro ao excluir profissional:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#121214] font-bold flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            Painel Geral de Administração
          </h1>
          <p className="text-[#889B8C] mt-2">
            Gerenciamento geral da plataforma. Ative ou suspenda acessos de profissionais de forma direta.
          </p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-[#EBEBE3] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#EBEBE3] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#121214] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1E3F35]" />
            Terapeutas Cadastrados ({therapists.length})
          </h2>
          <button 
            onClick={fetchTherapists}
            className="px-3.5 py-1.5 bg-[#F5F4EE] hover:bg-[#EBEBE3] text-[#1E3F35] rounded-xl text-xs font-semibold transition-all border border-[#E2E2D9] cursor-pointer"
          >
            Atualizar Lista
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-[#889B8C]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3F35] mb-2" />
            <p>Carregando banco de dados de profissionais...</p>
          </div>
        ) : therapists.length === 0 ? (
          <div className="p-12 text-center text-[#889B8C]">
            Nenhum profissional cadastrado na plataforma até o momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBF9] text-[#889B8C] text-xs font-semibold uppercase tracking-wider border-b border-[#EBEBE3]">
                  <th className="p-4 pl-6">Nome / Clínica</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Status da Assinatura</th>
                  <th className="p-4 text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE3] text-sm text-[#2C3B30]">
                {therapists.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F5F4EE] transition-all">
                    <td className="p-4 pl-6 font-bold text-[#121214]">{t.name}</td>
                    <td className="p-4">{t.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        t.subscriptionStatus === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : t.subscriptionStatus === 'trial'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {t.subscriptionStatus === 'active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {t.subscriptionStatus === 'trial' && <AlertCircle className="w-3.5 h-3.5" />}
                        {t.subscriptionStatus === 'inactive' && <XCircle className="w-3.5 h-3.5" />}
                        <span className="capitalize">{t.subscriptionStatus === 'active' ? 'Ativo' : t.subscriptionStatus === 'trial' ? 'Avaliação' : 'Inativo'}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 space-x-2">
                      <button
                        disabled={updatingId === t.id}
                        onClick={() => handleUpdateStatus(t.id, 'active')}
                        className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        Ativar
                      </button>
                      <button
                        disabled={updatingId === t.id}
                        onClick={() => handleUpdateStatus(t.id, 'inactive')}
                        className="px-2.5 py-1 bg-amber-600 text-white hover:bg-amber-700 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        Suspender
                      </button>
                      <button
                        disabled={updatingId === t.id}
                        onClick={() => handleDeleteTherapist(t.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all inline-flex items-center justify-center cursor-pointer disabled:opacity-50"
                        title="Excluir profissional"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
