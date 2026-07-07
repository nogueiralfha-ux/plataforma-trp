import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserProfile, AnamneseData, DailyCheckIn, JournalEntry, 
  Protocol, Supplement, Exercise, Achievement, TerapeutaAppointment, Message 
} from './types';
import { useAuth } from './contexts/AuthContext';
import { auth, db } from './lib/firebase';
import { signOut } from 'firebase/auth';
  import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Importing subcomponents
import LoginCadastro from './components/LoginCadastro';
import Anamnese from './components/Anamnese';
import HomeDashboard from './components/HomeDashboard';
import CheckIn from './components/CheckIn';
import Jornada from './components/Jornada';
import Protocolos from './components/Protocolos';
import Exercicios from './components/Exercicios';
import Diario from './components/Diario';
import Alimentacao from './components/Alimentacao';
import Suplementacao from './components/Suplementacao';
import Biblioteca from './components/Biblioteca';
import Espiritual from './components/Espiritual';
import Terapeuta from './components/Terapeuta';
import IaChat from './components/IaChat';
import Conquistas from './components/Conquistas';
import Configuracoes from './components/Configuracoes';
import PacientesList from './components/PacientesList';
import AdminDashboard from './components/AdminDashboard';

import { 
  Heart, Sun, Compass, ClipboardList, Milestone, Calendar,
  Dumbbell, Feather, Apple, Pill, BookOpen, Sparkles, Award, 
  Settings, LogOut, Menu, X, UserCheck, Users, Loader2
} from 'lucide-react';

export default function App() {
  const { user: firebaseUser, profile, loading: authLoading } = useAuth();
  
  // Navigation State
  const [activeSection, setActiveSection] = useState<string>('pacientes');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Core Data States (Lazy Loaded from LocalStorage - representing the selected patient for now)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const data = localStorage.getItem('trp_user');
    return data ? JSON.parse(data) : { name: 'Paciente Demo', email: '', avatar: '🧘', createdAt: new Date().toISOString() };
  });

  const [anamnese, setAnamnese] = useState<AnamneseData>(() => {
    const data = localStorage.getItem('trp_anamnese');
    return data ? JSON.parse(data) : {
      completed: true,
      age: 30,
      gender: 'Outro',
      mainGoal: '',
      symptoms: [],
      sleepHours: 7,
      energyLevel: 5,
      dietStyle: 'Equilibrada',
      spiritualPractice: 'Nenhuma'
    };
  });

  const [checkins, setCheckins] = useState<DailyCheckIn[]>(() => {
    const data = localStorage.getItem('trp_checkins');
    return data ? JSON.parse(data) : [];
  });

  const [diaryEntries, setDiaryEntries] = useState<JournalEntry[]>(() => {
    const data = localStorage.getItem('trp_diary');
    return data ? JSON.parse(data) : [];
  });

  const [protocols, setProtocols] = useState<Protocol[]>(() => {
    const data = localStorage.getItem('trp_protocols');
    if (data) return JSON.parse(data);

    // Initial Default Seed Protocols
    return [
      { id: 'p1', name: 'Higiene do Sono Circadiana', description: 'Nenhum dispositivo eletrônico após as 21:00. Chá relaxante de camomila e mulungu.', category: 'Mental', duration: '20 min', completedDays: [], isActive: true },
      { id: 'p2', name: 'Hidratação Alcalina Matinal', description: 'Consumir 500ml de água morna filtrada imediatamente após acordar com limão espremido.', category: 'Alimentar', duration: '5 min', completedDays: [], isActive: true },
      { id: 'p3', name: 'Respiração Vagovagal Coerente', description: 'Sessão estruturada de 5 minutos inspirando em 4 segundos e expirando em 6 segundos.', category: 'Mental', duration: '5 min', completedDays: [], isActive: true },
      { id: 'p4', name: 'Alongamento Miofascial de Cadeias', description: 'Série leve de 10 minutos focando nos eretores da espinha, pescoço e panturrilhas.', category: 'Físico', duration: '10 min', completedDays: [], isActive: true },
      { id: 'p5', name: 'Prática de Silêncio Contemplativa', description: '5 minutos de meditação de presença ou oração sentada ao amanhecer.', category: 'Espiritual', duration: '5 min', completedDays: [], isActive: true }
    ];
  });

  const [supplements, setSupplements] = useState<Supplement[]>(() => {
    const data = localStorage.getItem('trp_supplements');
    if (data) return JSON.parse(data);

    // Initial Default Seed Supplements
    return [
      { id: 's1', name: 'Metilfolato + Metilcobalamina', dosage: '1 cápsula (Ativação neurológica)', time: '08:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} },
      { id: 's2', name: 'Coenzima Q10 (Ubiquinol)', dosage: '100 mg (Mitochondrial ATP)', time: '08:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} },
      { id: 's3', name: 'Ômega 3 DHA/EPA Concentrado', dosage: '1000 mg (Anti-inflamatório)', time: '13:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} },
      { id: 's4', name: 'Magnésio Inositol + L-Teanina', dosage: '300 mg (Modulador Gaba)', time: '21:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} }
    ];
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const data = localStorage.getItem('trp_exercises');
    if (data) return JSON.parse(data);

    // Initial Default Seed Exercises
    return [
      { id: 'e1', name: 'Respiração Vagal Guiada', duration: 300, description: 'Sequências rítmicas de fole e expiração calma para desarmar o estresse físico instantaneamente.', category: 'Respiração', completedHistory: [] },
      { id: 'e2', name: 'Liberação de Fascia Cervical', duration: 180, description: 'Retração de queixo isométrica controlada contra apoio para liberar tensão nos trapézios superiores.', category: 'Fisioterapia', completedHistory: [] },
      { id: 'e3', name: 'Mobilização Pélvica / Gato-Camelo', duration: 240, description: 'Exercícios dinâmicos de flexão e extensão de coluna em 4 apoios para lubrificação discal lombar.', category: 'Mobilidade', completedHistory: [] },
      { id: 'e4', name: 'Meditação de Presença Integral', duration: 480, description: 'Direcionamento suave do foco de atenção para o fluxo do ar nos pulmões e descontração muscular.', category: 'Meditação', completedHistory: [] }
    ];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const data = localStorage.getItem('trp_achievements');
    if (data) return JSON.parse(data);

    return [
      { id: 'a1', title: 'Primeiro Alento', description: 'Efetuar seu primeiro Check-In de autoavaliação.', icon: '🌅' },
      { id: 'a2', title: 'Firme na Suplementação', description: 'Tomar 100% dos seus compostos prescritos em um dia.', icon: '🛡️' },
      { id: 'a3', title: 'Plena Hidratação', description: 'Registrar mais de 2.0L de água em um único dia.', icon: '💧' },
      { id: 'a4', title: 'Alquimia Mental', description: 'Completar sua primeira entrada de diário analisada por IA.', icon: '🧘' }
    ];
  });

  const [appointments, setAppointments] = useState<TerapeutaAppointment[]>(() => {
    const data = localStorage.getItem('trp_appointments');
    return data ? JSON.parse(data) : [];
  });

  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    const data = localStorage.getItem('trp_chat_messages');
    return data ? JSON.parse(data) : [];
  });

  const [chatLoading, setChatLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadPatientData() {
      if (firebaseUser && selectedPatientId) {
        try {
          const docRef = doc(db, 'anamneses', `${firebaseUser.uid}_${selectedPatientId}`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setAnamnese(docSnap.data().data);
          }
        } catch (e) {
          console.error("Erro ao carregar anamnese:", e);
        }
      }
    }
    loadPatientData();
  }, [selectedPatientId, firebaseUser]);

  // Load data for the selected patient
  useEffect(() => {
    if (!selectedPatientId) return;

    const savedUser = localStorage.getItem(`trp_patient_${selectedPatientId}_user`);
    setUser(savedUser ? JSON.parse(savedUser) : { name: 'Paciente', email: '', avatar: '🧘', createdAt: new Date().toISOString() });

    const savedCheckins = localStorage.getItem(`trp_patient_${selectedPatientId}_checkins`);
    setCheckins(savedCheckins ? JSON.parse(savedCheckins) : []);

    const savedDiary = localStorage.getItem(`trp_patient_${selectedPatientId}_diary`);
    setDiaryEntries(savedDiary ? JSON.parse(savedDiary) : []);

    const savedProtocols = localStorage.getItem(`trp_patient_${selectedPatientId}_protocols`);
    if (savedProtocols) {
      setProtocols(JSON.parse(savedProtocols));
    } else {
      setProtocols([
        { id: 'p1', name: 'Higiene do Sono Circadiana', description: 'Nenhum dispositivo eletrônico após as 21:00. Chá relaxante de camomila e mulungu.', category: 'Mental', duration: '20 min', completedDays: [], isActive: true },
        { id: 'p2', name: 'Hidratação Alcalina Matinal', description: 'Consumir 500ml de água morna filtrada imediatamente após acordar com limão espremido.', category: 'Alimentar', duration: '5 min', completedDays: [], isActive: true },
        { id: 'p3', name: 'Respiração Vagovagal Coerente', description: 'Sessão estruturada de 5 minutos inspirando em 4 segundos e expirando em 6 segundos.', category: 'Mental', duration: '5 min', completedDays: [], isActive: true },
        { id: 'p4', name: 'Alongamento Miofascial de Cadeias', description: 'Série leve de 10 minutos focando nos eretores da espinha, pescoço e panturrilhas.', category: 'Físico', duration: '10 min', completedDays: [], isActive: true },
        { id: 'p5', name: 'Prática de Silêncio Contemplativa', description: '5 minutos de meditação de presença ou oração sentada ao amanhecer.', category: 'Espiritual', duration: '5 min', completedDays: [], isActive: true }
      ]);
    }

    const savedSupplements = localStorage.getItem(`trp_patient_${selectedPatientId}_supplements`);
    if (savedSupplements) {
      setSupplements(JSON.parse(savedSupplements));
    } else {
      setSupplements([
        { id: 's1', name: 'Metilfolato + Metilcobalamina', dosage: '1 cápsula (Ativação neurológica)', time: '08:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} },
        { id: 's2', name: 'Coenzima Q10 (Ubiquinol)', dosage: '100 mg (Mitochondrial ATP)', time: '08:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} },
        { id: 's3', name: 'Ômega 3 DHA/EPA Concentrado', dosage: '1000 mg (Anti-inflamatório)', time: '13:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} },
        { id: 's4', name: 'Magnésio Inositol + L-Teanina', dosage: '300 mg (Modulador Gaba)', time: '21:00', daysOfWeek: [1,2,3,4,5,6,0], completedHistory: {} }
      ]);
    }

    const savedExercises = localStorage.getItem(`trp_patient_${selectedPatientId}_exercises`);
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises));
    } else {
      setExercises([
        { id: 'e1', name: 'Respiração Vagal Guiada', duration: 300, description: 'Sequências rítmicas de fole e expiração calma para desarmar o estresse físico instantaneamente.', category: 'Respiração', completedHistory: [] },
        { id: 'e2', name: 'Liberação de Fascia Cervical', duration: 180, description: 'Retração de queixo isométrica controlada contra apoio para liberar tensão nos trapézios superiores.', category: 'Fisioterapia', completedHistory: [] },
        { id: 'e3', name: 'Mobilização Pélvica / Gato-Camelo', duration: 240, description: 'Exercícios dinâmicos de flexão e extensão de coluna em 4 apoios para lubrificação discal lombar.', category: 'Mobilidade', completedHistory: [] },
        { id: 'e4', name: 'Meditação de Presença Integral', duration: 480, description: 'Direcionamento suave do foco de atenção para o fluxo do ar nos pulmões e descontração muscular.', category: 'Meditação', completedHistory: [] }
      ]);
    }

    const savedAchievements = localStorage.getItem(`trp_patient_${selectedPatientId}_achievements`);
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements([
        { id: 'a1', title: 'Primeiro Alento', description: 'Efetuar seu primeiro Check-In de autoavaliação.', icon: '🌅' },
        { id: 'a2', title: 'Firme na Suplementação', description: 'Tomar 100% dos seus compostos prescritos em um dia.', icon: '🛡️' },
        { id: 'a3', title: 'Plena Hidratação', description: 'Registrar mais de 2.0L de água em um único dia.', icon: '💧' },
        { id: 'a4', title: 'Alquimia Mental', description: 'Completar sua primeira entrada de diário analisada por IA.', icon: '🧘' }
      ]);
    }

    const savedAppointments = localStorage.getItem(`trp_patient_${selectedPatientId}_appointments`);
    setAppointments(savedAppointments ? JSON.parse(savedAppointments) : []);

    const savedChat = localStorage.getItem(`trp_patient_${selectedPatientId}_chat_messages`);
    setChatMessages(savedChat ? JSON.parse(savedChat) : []);
  }, [selectedPatientId]);

  // Sync state with local storage
  useEffect(() => {
    if (user && selectedPatientId) localStorage.setItem(`trp_patient_${selectedPatientId}_user`, JSON.stringify(user));
  }, [user, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) {
      localStorage.setItem(`trp_patient_${selectedPatientId}_checkins`, JSON.stringify(checkins));
      
      // Check if achievements need unlocking after check-ins change
      if (checkins.length > 0) {
        unlockAchievement('a1');
      }
      const todayStr = new Date().toISOString().split('T')[0];
      const todayCheckin = checkins.find(c => c.date === todayStr);
      if (todayCheckin && todayCheckin.water >= 2000) {
        unlockAchievement('a3');
      }
    }
  }, [checkins, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) {
      localStorage.setItem(`trp_patient_${selectedPatientId}_diary`, JSON.stringify(diaryEntries));
      if (diaryEntries.length > 0) {
        unlockAchievement('a4');
      }
    }
  }, [diaryEntries, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) localStorage.setItem(`trp_patient_${selectedPatientId}_protocols`, JSON.stringify(protocols));
  }, [protocols, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) localStorage.setItem(`trp_patient_${selectedPatientId}_supplements`, JSON.stringify(supplements));
  }, [supplements, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) localStorage.setItem(`trp_patient_${selectedPatientId}_exercises`, JSON.stringify(exercises));
  }, [exercises, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) localStorage.setItem(`trp_patient_${selectedPatientId}_achievements`, JSON.stringify(achievements));
  }, [achievements, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) localStorage.setItem(`trp_patient_${selectedPatientId}_appointments`, JSON.stringify(appointments));
  }, [appointments, selectedPatientId]);

  useEffect(() => {
    if (selectedPatientId) localStorage.setItem(`trp_patient_${selectedPatientId}_chat_messages`, JSON.stringify(chatMessages));
  }, [chatMessages, selectedPatientId]);

  // Gamification unlock helper
  const unlockAchievement = (id: string) => {
    setAchievements(prev => 
      prev.map(ach => {
        if (ach.id === id && !ach.unlockedAt) {
          return { ...ach, unlockedAt: new Date().toISOString() };
        }
        return ach;
      })
    );
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
  };

  const handleAnamneseSave = async (data: AnamneseData) => {
    setAnamnese(data);
    
    if (firebaseUser && selectedPatientId) {
      try {
        await setDoc(doc(db, 'anamneses', `${firebaseUser.uid}_${selectedPatientId}`), {
          therapistId: firebaseUser.uid,
          patientId: selectedPatientId,
          data: data,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Erro ao salvar anamnese no banco:", err);
      }
    }
  };

  const handleAddCheckin = (checkin: DailyCheckIn) => {
    setCheckins(prev => {
      const filtered = prev.filter(c => c.date !== checkin.date);
      return [checkin, ...filtered];
    });
  };

  const handleAddDiaryEntry = (entry: JournalEntry) => {
    setDiaryEntries(prev => [entry, ...prev]);
  };

  const handleToggleProtocol = (id: string, date: string) => {
    setProtocols(prev => 
      prev.map(p => {
        if (p.id === id) {
          const completedDays = p.completedDays.includes(date)
            ? p.completedDays.filter(d => d !== date)
            : [...p.completedDays, date];
          return { ...p, completedDays };
        }
        return p;
      })
    );
  };

  const handleAddCustomProtocol = (name: string, description: string, category: any) => {
    const newP: Protocol = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      category,
      duration: '15 min',
      completedDays: [],
      isActive: true
    };
    setProtocols(prev => [...prev, newP]);
  };

  const handleToggleSupplement = (id: string, date: string) => {
    setSupplements(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          const currentlyTaken = s.completedHistory[date] || false;
          return {
            ...s,
            completedHistory: {
              ...s.completedHistory,
              [date]: !currentlyTaken
            }
          };
        }
        return s;
      });

      // Check if all active supplements for today are completed for the achievement
      const todayDay = new Date().getDay();
      const activeSupps = updated.filter(s => s.daysOfWeek.includes(todayDay));
      const allTaken = activeSupps.length > 0 && activeSupps.every(s => s.completedHistory[date]);
      if (allTaken) {
        unlockAchievement('a2');
      }

      return updated;
    });
  };

  const handleAddSupplement = (name: string, dosage: string, time: string, daysOfWeek: number[]) => {
    const newS: Supplement = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      dosage,
      time,
      daysOfWeek,
      completedHistory: {}
    };
    setSupplements(prev => [...prev, newS]);
  };

  const handleCompleteExercise = (id: string, date: string) => {
    setExercises(prev => 
      prev.map(ex => {
        if (ex.id === id) {
          return {
            ...ex,
            completedHistory: [...ex.completedHistory, date]
          };
        }
        return ex;
      })
    );
  };

  const handleAddAppointment = (appt: TerapeutaAppointment) => {
    setAppointments(prev => [appt, ...prev]);
  };

  const handleSendChatMessage = async (text: string) => {
    const userMessage: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const anamneseContext = anamnese ? `
Informações da Anamnese do Paciente:
- Idade: ${anamnese.age}
- Gênero: ${anamnese.gender}
- Objetivo Principal: ${anamnese.mainGoal}
- Sintomas Atuais: ${anamnese.symptoms.join(', ') || 'Nenhum'}
- Sono: ${anamnese.sleepHours}h/noite
- Energia: ${anamnese.energyLevel}/10
- Dieta: ${anamnese.dietStyle}
- Prática Espiritual: ${anamnese.spiritualPractice}
- Atividade Física: ${anamnese.physicalActivity || 'Não informado'}
- Consumo de Água: ${anamnese.waterIntake || 'Não informado'}
- Nível de Estresse: ${anamnese.stressLevel || 'Não informado'}/10
- Medicações/Suplementos: ${anamnese.currentMedications || 'Não informado'}
` : '';

      const systemPrompt = `Você é um mentor terapeuta/coaching acolhedor, profissional e prestativo, focado em ajudar o usuário a se recuperar fisicamente, mentalmente e espiritualmente no protocolo TRP. Responda em português de forma clara, empática e motivadora. Nunca prescreva medicamentos médicos, foque em hábitos saudáveis, respiração, exercícios leves e equilíbrio.

${anamneseContext}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, systemPrompt })
      });

      if (!response.ok) {
        throw new Error('API server failed');
      }

      const data = await response.json();
      const aiMessage: Message = {
        sender: 'ai',
        text: data.text || 'Desculpe, tive um contratempo para responder. Siga respirando fundo.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        sender: 'ai',
        text: 'Olá! Sou seu assistente de suporte local offline. Lembre-se de tomar água, manter a calma e seguir o seu cronograma de suplementos hoje.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleUpdateWaterDirectly = (amount: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = checkins.find(c => c.date === todayStr);

    if (existing) {
      handleAddCheckin({
        ...existing,
        water: Math.max(0, existing.water + amount)
      });
    } else {
      handleAddCheckin({
        date: todayStr,
        physical: 3,
        emotional: 3,
        spiritual: 3,
        sleep: 7,
        water: Math.max(0, amount),
        steps: 0,
        notes: 'Registro rápido de água'
      });
    }
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setUser(null);
    setAnamnese({
      completed: false,
      age: 30,
      gender: 'Outro',
      mainGoal: '',
      symptoms: [],
      sleepHours: 7,
      energyLevel: 5,
      dietStyle: 'Equilibrada',
      spiritualPractice: 'Nenhuma'
    });
    setCheckins([]);
    setDiaryEntries([]);
    setAppointments([]);
    setChatMessages([]);
    setActiveSection('home');
    window.location.reload();
  };

  // Helper mapping to check current check-in completion state
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckin = checkins.find(c => c.date === todayStr);

  // Authentication & Anamnese Screening checks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0C0C0E] flex flex-col items-center justify-center text-[#B89650]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="mt-4 text-sm font-medium tracking-wider uppercase">Carregando Painel...</span>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginCadastro />;
  }

  // Segment Navigation Config
  const menuItems = [
    { id: 'pacientes', label: 'Meus Pacientes', icon: <Users className="w-4 h-4" /> },
    { id: 'anamnese', label: 'Anamnese', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'home', label: 'Visão Geral Paciente', icon: <Sun className="w-4 h-4" /> },
    { id: 'checkin', label: 'Check-In do Paciente', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'jornada', label: 'Jornada', icon: <Milestone className="w-4 h-4" /> },
    { id: 'protocolos', label: 'Protocolo TRP', icon: <Heart className="w-4 h-4" /> },
    { id: 'exercicios', label: 'Exercícios', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'diario', label: 'Diário Emocional', icon: <Feather className="w-4 h-4" /> },
    { id: 'alimentacao', label: 'Nutrição', icon: <Apple className="w-4 h-4" /> },
    { id: 'suplementacao', label: 'Suplementos', icon: <Pill className="w-4 h-4" /> },
    { id: 'biblioteca', label: 'Biblioteca', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'espiritual', label: 'Conexão', icon: <Compass className="w-4 h-4" /> },
    { id: 'ia', label: 'Mentor IA (Simulação)', icon: <Sparkles className="w-4 h-4 text-[#B89650]" /> },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-4 h-4" /> }
  ];

  if (firebaseUser?.email === 'nogueiralfha@gmail.com') {
    menuItems.push({ id: 'admin', label: 'Painel Admin', icon: <ShieldCheck className="w-4 h-4 text-amber-500 font-bold" /> });
  }

  const handleNavigate = (sec: string) => {
    setActiveSection(sec);
    setMobileMenuOpen(false);
  };

  return (
    <div id="app-root-viewport" className="min-h-screen bg-[#F5F4EE] text-[#2C3B30] flex flex-col md:flex-row antialiased font-sans">
      
      {/* Mobile Top Header utility bar */}
      <header className="md:hidden bg-white border-b border-[#EBEBE3] px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1E3F35] text-white rounded-lg flex items-center justify-center font-bold text-sm">
            T
          </div>
          <span className="font-serif font-bold text-[#1E3F35] text-base">Protocolo TRP</span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-lg text-[#1E3F35] hover:bg-[#F5F4EE] transition-all"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Main Responsive Left Navigation Sidebar */}
      <nav id="left-sidebar" className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 bg-white border-r border-[#EBEBE3] flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out`}>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo element branding */}
          <div className="p-6 border-b border-[#F0F0E9] hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E3F35] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#1E3F35]/25">
              TRP
            </div>
            <div>
              <span className="font-serif font-bold text-base text-[#1E3F35] leading-none block">Protocolo TRP</span>
              <span className="text-[9px] text-[#889B8C] font-semibold tracking-wider uppercase">Cura Integral</span>
            </div>
          </div>

          {/* Nav list selection links */}
          <div className="p-4 space-y-1">
            {menuItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active 
                      ? 'bg-[#1E3F35] text-white shadow-md shadow-[#1E3F35]/15 font-bold' 
                      : 'text-[#607062] hover:text-[#1E3F35] hover:bg-[#F5F4EE]'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-[#889B8C]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User mini status details footer */}
        <div className="p-4 border-t border-[#F0F0E9] flex items-center justify-between bg-[#FAFBF9]">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl w-9 h-9 bg-white border border-[#E2E2D9] rounded-lg flex items-center justify-center shrink-0">
              {'👨‍⚕️'}
            </span>
            <div className="truncate text-left">
              <span className="text-xs font-bold text-[#1E3F35] block truncate">{profile?.name || firebaseUser?.displayName || 'Terapeuta'}</span>
              <span className="text-[10px] text-[#889B8C] block truncate">{firebaseUser?.email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await signOut(auth);
              window.location.reload();
            }}
            className="p-1.5 rounded-lg text-[#889B8C] hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </nav>

      {/* Background shadow overlay for mobile panel */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main content display viewport */}
      <main className="flex-1 overflow-y-auto relative z-10 px-2 md:px-6 py-6 max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            {activeSection === 'pacientes' && (
              <PacientesList 
                onSelectPatient={(id) => {
                  setSelectedPatientId(id);
                  handleNavigate('home');
                }} 
              />
            )}

            {activeSection === 'configuracoes' && (
              <Configuracoes 
                user={user} 
                onUpdateUser={setUser} 
                onResetAllData={handleResetAllData} 
              />
            )}

            {activeSection === 'admin' && firebaseUser?.email === 'nogueiralfha@gmail.com' && (
              <AdminDashboard />
            )}

            {activeSection !== 'pacientes' && activeSection !== 'configuracoes' && activeSection !== 'admin' && !selectedPatientId && (
              <div className="max-w-md mx-auto text-center py-16 bg-white border border-[#EBEBE3] rounded-3xl p-8 shadow-sm my-12">
                <Users className="w-12 h-12 text-[#1E3F35] mx-auto mb-4" />
                <h2 className="text-xl font-serif font-bold text-[#121214]">Nenhum Paciente Selecionado</h2>
                <p className="text-sm text-[#889B8C] mt-2 mb-6">
                  Selecione um paciente na aba "Meus Pacientes" para visualizar e gerenciar as informações, prontuários, diários e protocolos dele.
                </p>
                <button
                  onClick={() => handleNavigate('pacientes')}
                  className="px-6 py-2.5 bg-[#1E3F35] hover:bg-[#2C3B30] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Ver Meus Pacientes
                </button>
              </div>
            )}

            {selectedPatientId && (
              <>
                {activeSection === 'anamnese' && (
                  <Anamnese 
                    initialData={anamnese}
                    onSave={(data) => {
                      handleAnamneseSave(data);
                      handleNavigate('home');
                    }} 
                  />
                )}

                {activeSection === 'home' && (
                  <HomeDashboard 
                    user={user} 
                    checkins={checkins} 
                    protocols={protocols} 
                    supplements={supplements}
                    achievements={achievements}
                    onNavigate={handleNavigate}
                  />
                )}

                {activeSection === 'checkin' && (
                  <CheckIn 
                    existingCheckin={todayCheckin} 
                    onSave={handleAddCheckin} 
                  />
                )}

                {activeSection === 'jornada' && (
                  <Jornada checkins={checkins} />
                )}

                {activeSection === 'protocolos' && (
                  <Protocolos 
                    protocols={protocols} 
                    onToggleProtocol={handleToggleProtocol}
                    onAddCustomProtocol={handleAddCustomProtocol}
                  />
                )}

                {activeSection === 'exercicios' && (
                  <Exercicios 
                    exercises={exercises} 
                    onCompleteExercise={handleCompleteExercise} 
                  />
                )}

                {activeSection === 'diario' && (
                  <Diario 
                    entries={diaryEntries} 
                    onAddEntry={handleAddDiaryEntry} 
                  />
                )}

                {activeSection === 'alimentacao' && (
                  <Alimentacao 
                    todayCheckin={todayCheckin} 
                    onUpdateWater={handleUpdateWaterDirectly} 
                  />
                )}

                {activeSection === 'suplementacao' && (
                  <Suplementacao 
                    supplements={supplements} 
                    onToggleSupplement={handleToggleSupplement}
                    onAddSupplement={handleAddSupplement}
                  />
                )}

                {activeSection === 'biblioteca' && (
                  <Biblioteca />
                )}

                {activeSection === 'espiritual' && (
                  <Espiritual />
                )}

                {activeSection === 'terapeuta' && (
                  <Terapeuta 
                    user={user} 
                    checkins={checkins} 
                    entries={diaryEntries} 
                    appointments={appointments}
                    onAddAppointment={handleAddAppointment}
                  />
                )}

                {activeSection === 'ia' && (
                  <IaChat 
                    user={user} 
                    messages={chatMessages} 
                    onSendMessage={handleSendChatMessage} 
                    loading={chatLoading} 
                  />
                )}

                {activeSection === 'conquistas' && (
                  <Conquistas 
                    achievements={achievements} 
                    checkins={checkins} 
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
