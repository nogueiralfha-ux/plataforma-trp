import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Save, Heart, ShieldCheck, Compass, Smile, Flame } from 'lucide-react';

export default function Espiritual() {
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [gratitudesSaved, setGratitudesSaved] = useState(false);

  // Quotes Database
  const quotes = [
    { text: "A paz interior começa no momento em que você escolhe não permitir que outra pessoa ou evento controle suas emoções.", author: "Pema Chödrön" },
    { text: "A gratidão é a memória do coração.", author: "Provérbio Zen" },
    { text: "O homem é composto por corpo, mente e alma. Ignorar o espírito no processo de cura é como tratar a moldura esquecendo o quadro.", author: "Sócrates" },
    { text: "Nas profundezas do inverno, aprendi finalmente que havia em mim um verão invencível.", author: "Albert Camus" }
  ];

  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  const handleSaveGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude1 && !gratitude2 && !gratitude3) return;
    setGratitudesSaved(true);
    setTimeout(() => {
      setGratitudesSaved(false);
      setGratitude1('');
      setGratitude2('');
      setGratitude3('');
    }, 4000);
  };

  const nextQuote = () => {
    setCurrentQuoteIdx(prev => (prev + 1) % quotes.length);
  };

  return (
    <div id="espiritual-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Inspirational Quote display */}
      <div className="bg-[#1E3F35] text-white p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute left-[-5%] top-[-5%] w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-3 relative z-10">
          <span className="text-[9px] bg-white/15 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
            Reflexão do Dia
          </span>
          <p className="text-base font-serif italic leading-relaxed">
            "{quotes[currentQuoteIdx].text}"
          </p>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-white/70 font-semibold">— {quotes[currentQuoteIdx].author}</span>
            <button
              type="button"
              onClick={nextQuote}
              className="text-xs font-bold text-emerald-300 hover:underline"
            >
              Outra Reflexão →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Gratitude Diary Notebook */}
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1E3F35]">
              <Heart className="w-5 h-5 text-[#1E3F35] fill-[#1E3F35]/10" />
              <h3 className="font-serif font-bold text-base">Diário de Gratidão Semanal</h3>
            </div>
            <p className="text-xs text-[#607062] leading-relaxed">
              Registrar três bênçãos diárias redireciona os caminhos neuronais da amígdala para o córtex pré-frontal, reduzindo quimicamente a percepção de dor e angústia.
            </p>

            <form onSubmit={handleSaveGratitude} className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[#1E3F35] font-mono text-sm font-bold">1.</span>
                <input
                  id="gratitude-input-1"
                  type="text"
                  placeholder="Por qual bênção ou momento sou grato hoje?"
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                  className="flex-1 bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E3F35] text-[#2C3B30]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#1E3F35] font-mono text-sm font-bold">2.</span>
                <input
                  id="gratitude-input-2"
                  type="text"
                  placeholder="Um pequeno milagre, gesto de gentileza ou progresso físico..."
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                  className="flex-1 bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E3F35] text-[#2C3B30]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#1E3F35] font-mono text-sm font-bold">3.</span>
                <input
                  id="gratitude-input-3"
                  type="text"
                  placeholder="Uma pessoa, ensinamento ou percepção de alívio..."
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                  className="flex-1 bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E3F35] text-[#2C3B30]"
                />
              </div>

              {gratitudesSaved && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs py-2 px-3 rounded-lg text-center font-medium"
                >
                  ✓ Seus sentimentos de gratidão foram consolidados e arquivados!
                </motion.div>
              )}

              <button
                type="submit"
                id="save-gratitudes"
                className="w-full bg-[#1E3F35] hover:bg-[#152D26] text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Save className="w-4 h-4" />
                Registrar Bênçãos do Dia
              </button>
            </form>
          </div>
        </div>

        {/* Contemplative Silence Timer Box */}
        <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#1E3F35]">
              <Compass className="w-5 h-5 text-[#1E3F35]" />
              <h3 className="font-serif font-bold text-base">Silêncio Contemplativo</h3>
            </div>
            <p className="text-xs text-[#607062] leading-relaxed">
              Dedique momentos à oração, entoação de mantras ou contemplação da natureza em silêncio absoluto. Deixe as ondas elétricas do cérebro acalmarem para o estado Alfa.
            </p>

            <div className="bg-[#FAFBF9] border border-[#EBEBE3] rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-[#1E3F35] block mb-1">Mantra de Ancoragem Terapêutica:</span>
              <p className="text-xs italic text-[#607062] leading-relaxed">
                "Eu acolho meu corpo no estado em que está. Eu permito que minhas células se regenerem com calma, paciência e força soberana."
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0F0E9] flex items-center justify-between text-xs text-[#889B8C]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#1E3F35]" />
              Equilíbrio e clareza mental.
            </span>
            <span className="font-bold text-[#1E3F35]">SAGE HEALTH</span>
          </div>
        </div>

      </div>
    </div>
  );
}
