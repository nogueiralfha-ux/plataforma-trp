import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginCadastro() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update auth profile
        await updateProfile(user, { displayName: name || 'Terapeuta' });
        
        // Create therapist profile in Firestore
        await setDoc(doc(db, 'therapists', user.uid), {
          name: name || 'Terapeuta',
          email: user.email,
          subscriptionStatus: 'trial',
          createdAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro durante a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen bg-[#0C0C0E] text-[#E0E0E0] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#B89650]/10 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#B89650]/10 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#121214] p-8 rounded-3xl shadow-2xl border border-[#1F1F23]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#B89650] text-[#121214] rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-serif tracking-tight text-[#B89650] text-center font-semibold">
            Protocolo TRP
          </h1>
          <p className="text-[#8E8E93] text-sm mt-2 text-center">
            Plataforma para Terapeutas e Clínicas.
          </p>
        </div>

        <div className="flex bg-[#1C1C20] p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-[#121214] text-[#B89650] shadow-sm border border-[#1F1F23]' : 'text-[#8E8E93] hover:text-[#E0E0E0]'}`}
          >
            Cadastro de Terapeuta
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-[#121214] text-[#B89650] shadow-sm border border-[#1F1F23]' : 'text-[#8E8E93] hover:text-[#E0E0E0]'}`}
          >
            Acesso
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-2">
                Nome do Terapeuta ou Clínica
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-[#66666E]" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1C1C20] border border-[#1F1F23] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B89650]/30 focus:border-[#B89650] transition-all text-[#E0E0E0]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-2">
              E-mail Profissional
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-[#66666E]" />
              <input
                type="email"
                required
                placeholder="terapeuta@clinica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1C1C20] border border-[#1F1F23] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B89650]/30 focus:border-[#B89650] transition-all text-[#E0E0E0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-[#66666E]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1C1C20] border border-[#1F1F23] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B89650]/30 focus:border-[#B89650] transition-all text-[#E0E0E0]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B89650] hover:bg-[#9A7D3E] text-[#121214] py-3.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all mt-2 group disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Acessar Painel' : 'Criar Conta de Terapeuta'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1F1F23] flex items-center justify-center gap-2 text-xs text-[#8E8E93]">
          <ShieldCheck className="w-4 h-4 text-[#B89650]" />
          <span>Plataforma SaaS segura em nuvem para terapeutas.</span>
        </div>
      </motion.div>
    </div>
  );
}
