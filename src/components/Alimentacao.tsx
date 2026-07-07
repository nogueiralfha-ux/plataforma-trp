import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DailyCheckIn } from '../types';
import { 
  GlassWater, Sparkles, AlertTriangle, Apple, 
  ChevronRight, Compass, ShieldCheck, Flame
} from 'lucide-react';

interface AlimentacaoProps {
  todayCheckin?: DailyCheckIn;
  onUpdateWater: (amount: number) => void;
}

export default function Alimentacao({ todayCheckin, onUpdateWater }: AlimentacaoProps) {
  const currentWater = todayCheckin?.water || 0;
  const waterPercentage = Math.min(100, Math.round((currentWater / 2500) * 100));

  const [activeTab, setActiveTab] = useState<'cardapio' | 'diretrizes'>('cardapio');

  const meals = [
    {
      type: 'Café da Manhã',
      time: '08:00',
      menu: 'Suco Verde Terapêutico (Couve, Gengibre, Limão e Hortelã) + Ovos mexidos com cúrcuma e azeite extravirgem.',
      benefits: 'Ativação imunológica, efeito antioxidante e estímulo celular saudável.',
      calories: '280 kcal'
    },
    {
      type: 'Almoço',
      time: '12:30',
      menu: 'Salmão Grelhado ou Filé de Frango Grelhado, Arroz Integral, Brócolis cozido no vapor com bastante alho picado e salada verde escura com sementes de abóbora.',
      benefits: 'Altíssimo em Omega-3 e Zinco. Reduz citocinas pró-inflamatórias.',
      calories: '490 kcal'
    },
    {
      type: 'Lanche da Tarde',
      time: '16:00',
      menu: 'Mix de Nozes e Castanhas-do-pará (ricas em Selênio) + Chá de hibisco ou camomila sem açúcar.',
      benefits: 'Nutrição celular, cognição cerebral e alívio do estresse.',
      calories: '180 kcal'
    },
    {
      type: 'Jantar',
      time: '19:30',
      menu: 'Sopa cremosa de Abóbora com gengibre, frango desfiado e sementes de gergelim por cima.',
      benefits: 'Sono facilitado, digestão ultraleve e regulação circadiana.',
      calories: '310 kcal'
    }
  ];

  const guidelines = [
    { title: 'Evite Açúcares Refinados', desc: 'O açúcar refinado desencadeia liberação em massa de citocinas inflamatórias, gerando dores musculares e neblina mental.' },
    { title: 'Corte Óleos de Soja e Milho', desc: 'Ricos em Omega-6 desbalanceado. Dê preferência absoluta a azeite extravirgem prensado a frio e óleo de coco.' },
    { title: 'Inclua Especiarias de Ouro', desc: 'A cúrcuma (açafrão-da-terra) associada a uma pitada de pimenta-preta aumenta a absorção da curcumina em até 2000%.' },
    { title: 'Foque em Alimentos Crus', desc: 'Saladas e folhas ricas em clorofila alcalinizam o sangue e auxiliam o corpo a purificar toxinas acumuladas.' }
  ];

  return (
    <div id="alimentacao-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Hydration Interactive Workspace Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 flex flex-col justify-between shadow-sm md:col-span-1">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mx-auto mb-3">
              <GlassWater className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1E3F35]">Hidratação de Precisão</h3>
            <p className="text-xs text-[#607062] mt-1 mb-4 leading-relaxed">
              A hidratação constante mantém a circulação celular e previne espasmos de ansiedade.
            </p>

            {/* Simulated Water Glass visual display */}
            <div className="relative w-28 h-36 border-4 border-[#1E3F35] rounded-b-2xl rounded-t-lg mx-auto overflow-hidden flex items-end mb-4 shadow-sm bg-[#F5F4EE]">
              <motion.div 
                initial={{ height: '0%' }}
                animate={{ height: `${waterPercentage}%` }}
                transition={{ duration: 0.8 }}
                className="w-full bg-[#1A82C3] opacity-80 relative flex items-center justify-center text-xs text-white font-bold font-mono"
                style={{ height: `${waterPercentage}%` }}
              >
                {waterPercentage > 15 && `${waterPercentage}%`}
              </motion.div>
            </div>

            <div className="text-xs text-[#607062] font-semibold">
              Registrado: <span className="text-[#1A82C3] font-bold">{(currentWater / 1000).toFixed(2)}L</span> / 2.50L
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              type="button"
              onClick={() => onUpdateWater(250)}
              className="bg-blue-50 hover:bg-blue-100 text-[#1A82C3] text-xs font-semibold py-2.5 rounded-xl border border-blue-200 transition-all"
            >
              +250ml
            </button>
            <button
              type="button"
              onClick={() => onUpdateWater(500)}
              className="bg-blue-50 hover:bg-blue-100 text-[#1A82C3] text-xs font-semibold py-2.5 rounded-xl border border-blue-200 transition-all"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Recipes and eating list */}
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex bg-[#F5F4EE] p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('cardapio')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'cardapio' ? 'bg-white text-[#1E3F35] shadow-sm' : 'text-[#607062] hover:text-[#1E3F35]'}`}
              >
                Cardápio Regenerativo Recomendado
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('diretrizes')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'diretrizes' ? 'bg-white text-[#1E3F35] shadow-sm' : 'text-[#607062] hover:text-[#1E3F35]'}`}
              >
                Diretrizes Alimentares
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'cardapio' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meals.map((meal) => (
                    <div key={meal.type} className="bg-[#FAFBF9] border border-[#EBEBE3] p-4 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-[#607062] uppercase tracking-wider">
                        <span>{meal.type}</span>
                        <span className="text-[#1E3F35]">{meal.time}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1E3F35]">{meal.menu.split('(')[0]}</h4>
                      <p className="text-[11px] text-[#607062] leading-relaxed">
                        {meal.menu}
                      </p>
                      <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 italic mt-2 inline-block">
                        {meal.benefits}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guidelines.map((guide) => (
                    <div key={guide.title} className="bg-white border border-[#EBEBE3] p-4 rounded-2xl flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-lg bg-amber-50 text-[#7E5109] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#1E3F35]">{guide.title}</h4>
                        <p className="text-[11px] text-[#607062] leading-relaxed">
                          {guide.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F0F0E9] flex items-center justify-between text-[11px] text-[#889B8C]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Dieta personalizada baseada em sua anamnese anti-inflamatória.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('diretrizes')}
              className="text-[#1E3F35] font-semibold hover:underline"
            >
              Ler diretrizes completas
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
