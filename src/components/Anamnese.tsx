import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AnamneseData } from '../types';
import { ClipboardList, Sparkles, Smile, Flame, Moon, Coffee } from 'lucide-react';

interface AnamneseProps {
  onSave: (data: AnamneseData) => void;
  initialData?: Partial<AnamneseData>;
}

export default function Anamnese({ onSave, initialData }: AnamneseProps) {
  const [age, setAge] = useState(initialData?.age || 30);
  const [gender, setGender] = useState(initialData?.gender || 'Outro');
  const [mainGoal, setMainGoal] = useState(initialData?.mainGoal || 'Alívio de Ansiedade');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialData?.symptoms || []);
  const [sleepHours, setSleepHours] = useState(initialData?.sleepHours || 7);
  const [energyLevel, setEnergyLevel] = useState(initialData?.energyLevel || 6);
  const [dietStyle, setDietStyle] = useState(initialData?.dietStyle || 'Equilibrada');
  const [spiritualPractice, setSpiritualPractice] = useState(initialData?.spiritualPractice || 'Meditação/Atenção Plena');
  const [physicalActivity, setPhysicalActivity] = useState(initialData?.physicalActivity || 'Moderado (3-4x/semana)');
  const [waterIntake, setWaterIntake] = useState(initialData?.waterIntake || '1.5 a 2.5 Litros');
  const [stressLevel, setStressLevel] = useState(initialData?.stressLevel || 5);
  const [currentMedications, setCurrentMedications] = useState(initialData?.currentMedications || '');

  useEffect(() => {
    if (initialData) {
      setAge(initialData.age || 30);
      setGender(initialData.gender || 'Outro');
      setMainGoal(initialData.mainGoal || 'Alívio de Ansiedade');
      setSelectedSymptoms(initialData.symptoms || []);
      setSleepHours(initialData.sleepHours || 7);
      setEnergyLevel(initialData.energyLevel || 6);
      setDietStyle(initialData.dietStyle || 'Equilibrada');
      setSpiritualPractice(initialData.spiritualPractice || 'Meditação/Atenção Plena');
      setPhysicalActivity(initialData.physicalActivity || 'Moderado (3-4x/semana)');
      setWaterIntake(initialData.waterIntake || '1.5 a 2.5 Litros');
      setStressLevel(initialData.stressLevel || 5);
      setCurrentMedications(initialData.currentMedications || '');
    }
  }, [initialData]);

  const goals = [
    'Alívio de Ansiedade e Estresse',
    'Recuperação Física e Reabilitação',
    'Melhoria do Sono e Ritmo Circadiano',
    'Desintoxicação e Vitalidade Metabólica',
    'Equilíbrio Emocional e Espiritual'
  ];

  const symptomsList = [
    'Fadiga Crônica', 'Dores no Corpo / Tensão', 'Insônia / Sono Leve',
    'Ansiedade / Agitação', 'Neblina Mental (Brain Fog)', 'Tristeza / Desânimo',
    'Problemas Digestivos', 'Falta de Foco / Distração'
  ];

  const diets = [
    'Equilibrada / Mediterrânea',
    'Vegetariana / Vegana',
    'Cetogênica / Low Carb',
    'Sem Glúten & Sem Lactose',
    'Anti-inflamatória'
  ];

  const practices = [
    'Meditação / Atenção Plena (Mindfulness)',
    'Orações / Prática Contemplativa',
    'Exercícios Respiratórios / Pranayamas',
    'Caminhadas na Natureza / Conexão',
    'Nenhuma / Buscando iniciar'
  ];

  const activityLevels = [
    'Sedentário (Nenhuma)',
    'Leve (1-2x/semana)',
    'Moderado (3-4x/semana)',
    'Intenso (5+x/semana)'
  ];

  const waterLevels = [
    'Menos de 1.5 Litros',
    '1.5 a 2.5 Litros',
    '2.5 a 3.5 Litros',
    'Mais de 3.5 Litros'
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleComplete = () => {
    const data: AnamneseData = {
      completed: true,
      age,
      gender,
      mainGoal,
      symptoms: selectedSymptoms,
      sleepHours,
      energyLevel,
      dietStyle,
      spiritualPractice,
      physicalActivity,
      waterIntake,
      stressLevel,
      currentMedications
    };
    onSave(data);
  };

  return (
    <div id="anamnese-wizard" className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-[#1E3F35]/10 text-[#1E3F35] rounded-full flex items-center justify-center mx-auto mb-3">
          <ClipboardList className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1E3F35]">Ficha de Anamnese Inicial</h2>
        <p className="text-[#607062] text-sm max-w-md mx-auto mt-1">
          Preencha a ficha do paciente para que a IA e os protocolos sejam calibrados com base em seu estado biopsicoespiritual.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 md:p-8 space-y-8 shadow-sm">
        {/* Basic profile info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
              Qual sua idade?
            </label>
            <div className="flex items-center gap-4 bg-[#F5F4EE] p-3 rounded-xl border border-[#E2E2D9]">
              <input
                id="anamnese-age"
                type="range"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full accent-[#1E3F35] cursor-pointer"
              />
              <span className="font-semibold text-lg text-[#1E3F35] w-12 text-center">{age} anos</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
              Identidade Biológica / Gênero
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Feminino', 'Masculino', 'Outro'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 text-xs font-medium rounded-xl border transition-all ${gender === g ? 'bg-[#1E3F35] text-white border-[#1E3F35]' : 'bg-white border-[#E2E2D9] text-[#607062] hover:bg-[#F5F4EE]'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-3">
            Qual o seu objetivo terapêutico prioritário?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setMainGoal(goal)}
                className={`p-4 text-left text-sm font-medium rounded-2xl border flex items-start gap-3 transition-all ${mainGoal === goal ? 'bg-[#1E3F35]/5 border-[#1E3F35] text-[#1E3F35] ring-1 ring-[#1E3F35]' : 'bg-white border-[#E2E2D9] text-[#2C3B30] hover:bg-[#F5F4EE]'}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 ${mainGoal === goal ? 'border-[#1E3F35] bg-[#1E3F35] text-white' : 'border-[#C8D1C9]'}`}>
                  {mainGoal === goal && <Sparkles className="w-3 h-3" />}
                </div>
                <span>{goal}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
            Quais sintomas ou desconfortos você enfrenta atualmente? (Selecione múltiplos)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {symptomsList.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 text-center text-xs font-medium rounded-xl border transition-all ${isSelected ? 'bg-[#D1E2D6] border-[#1E3F35] text-[#1E3F35] font-semibold' : 'bg-white border-[#E2E2D9] text-[#607062] hover:bg-[#F5F4EE]'}`}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Moon className="w-4 h-4 text-[#889B8C]" />
              Média de sono diário (Últimos 15 dias)
            </label>
            <div className="flex items-center gap-4 bg-[#F5F4EE] p-3 rounded-xl border border-[#E2E2D9]">
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-[#1E3F35] cursor-pointer"
              />
              <span className="font-semibold text-[#1E3F35] text-sm w-16 text-center">{sleepHours}h/noite</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Coffee className="w-4 h-4 text-[#889B8C]" />
              Seu nível de energia diária atual
            </label>
            <div className="flex items-center gap-4 bg-[#F5F4EE] p-3 rounded-xl border border-[#E2E2D9]">
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full accent-[#1E3F35] cursor-pointer"
              />
              <span className="font-semibold text-[#1E3F35] text-sm w-16 text-center">{energyLevel}/10 (Disposição)</span>
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
              Estilo Alimentar Atual
            </label>
            <select
              value={dietStyle}
              onChange={(e) => setDietStyle(e.target.value)}
              className="w-full bg-white border border-[#E2E2D9] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30]"
            >
              {diets.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
              Prática Mental / Espiritual Frequente
            </label>
            <select
              value={spiritualPractice}
              onChange={(e) => setSpiritualPractice(e.target.value)}
              className="w-full bg-white border border-[#E2E2D9] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30]"
            >
              {practices.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
              Nível de Atividade Física
            </label>
            <select
              value={physicalActivity}
              onChange={(e) => setPhysicalActivity(e.target.value)}
              className="w-full bg-white border border-[#E2E2D9] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30]"
            >
              {activityLevels.map((al) => (
                <option key={al} value={al}>{al}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
              Consumo de Água Diário
            </label>
            <select
              value={waterIntake}
              onChange={(e) => setWaterIntake(e.target.value)}
              className="w-full bg-white border border-[#E2E2D9] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30]"
            >
              {waterLevels.map((wl) => (
                <option key={wl} value={wl}>{wl}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Flame className="w-4 h-4 text-[#889B8C]" />
              Nível de Estresse / Sobrecarga Atual
            </label>
            <div className="flex items-center gap-4 bg-[#F5F4EE] p-3 rounded-xl border border-[#E2E2D9]">
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full accent-[#1E3F35] cursor-pointer"
              />
              <span className="font-semibold text-[#1E3F35] text-sm w-16 text-center">{stressLevel}/10</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-[#607062] uppercase tracking-wider mb-2">
              Medicações ou Suplementos em Uso
            </label>
            <input
              type="text"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="Ex: Ômega 3, Ritalina, Nenhum..."
              className="w-full bg-[#F5F4EE] border border-[#E2E2D9] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30]"
            />
          </div>
        </div>

        <button
          type="button"
          id="complete-anamnese"
          onClick={handleComplete}
          className="w-full bg-[#1E3F35] hover:bg-[#152D26] text-white py-4 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Smile className="w-5 h-5" />
          Salvar Ficha de Anamnese do Paciente
        </button>
      </div>
    </div>
  );
}
