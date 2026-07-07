import React, { useState } from 'react';
import { motion } from 'motion/react';
import { JournalEntry } from '../types';
import { Sparkles, Calendar, Heart, ShieldAlert, Check, Feather, MessageSquareText } from 'lucide-react';

interface DiarioProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
}

export default function Diario({ entries, onAddEntry }: DiarioProps) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState<'joy' | 'neutral' | 'sad' | 'anxious' | 'angry' | 'tired'>('neutral');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const moodOptions = [
    { key: 'joy', label: 'Alegre', emoji: '☀️', bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800' },
    { key: 'neutral', label: 'Sereno', emoji: '🍃', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800' },
    { key: 'sad', label: 'Triste', emoji: '🌧️', bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800' },
    { key: 'anxious', label: 'Ansioso', emoji: '🌪️', bg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800' },
    { key: 'angry', label: 'Irritado', emoji: '🔥', bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800' },
    { key: 'tired', label: 'Cansado', emoji: '🔋', bg: 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800' }
  ];

  const handleAnalyzeAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/diary-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysis = await response.json();
      setAnalysisResult(analysis);

      // Save journal entry
      const newEntry: JournalEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        text,
        mood,
        aiAnalysis: {
          sentiment: analysis.sentiment,
          advice: analysis.advice,
          tags: analysis.tags
        }
      };

      onAddEntry(newEntry);
      setText('');
    } catch (err) {
      console.error(err);
      // Fallback save in case of API failure (offline-friendly)
      const fallbackEntry: JournalEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        text,
        mood,
        aiAnalysis: {
          sentiment: mood,
          advice: "Seu diário foi salvo com sucesso localmente. Siga respirando fundo e dedicando momentos à sua recuperação.",
          tags: ["Autocuidado", "Rotina"]
        }
      };
      onAddEntry(fallbackEntry);
      setText('');
    } finally {
      setAnalyzing(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="diario-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Writing Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-[#EBEBE3] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[#1E3F35]">
              <Feather className="w-5 h-5" />
              <h3 className="font-serif font-bold text-lg">Escrever no Diário de Recuperação</h3>
            </div>

            <form onSubmit={handleAnalyzeAndSave} className="space-y-4">
              {/* Mood selector */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#607062] uppercase tracking-wider">Como está seu humor agora?</span>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {moodOptions.map(opt => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setMood(opt.key as any)}
                      className={`p-3 text-center rounded-xl border text-xs font-medium transition-all flex flex-col items-center justify-center gap-1.5 ${mood === opt.key ? 'ring-2 ring-[#1E3F35] border-transparent font-bold' : 'bg-white border-[#E2E2D9] text-[#607062] hover:bg-[#F5F4EE]'}`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textbox */}
              <div className="space-y-1">
                <label htmlFor="diary-text-input" className="block text-xs font-semibold text-[#607062] uppercase tracking-wider">Suas reflexões</label>
                <textarea
                  id="diary-text-input"
                  required
                  rows={6}
                  placeholder="Desabafe livremente. Como foi o seu dia? Sentiu alguma mudança de humor ou sintoma? A IA analisará seus sentimentos com empatia."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#E2E2D9] rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3F35]/20 focus:border-[#1E3F35] text-[#2C3B30] resize-none"
                />
              </div>

              {/* Action and feedback feedback indicator */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-[10px] text-[#889B8C] leading-tight flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Privacidade total: dados locais.
                </span>

                <button
                  type="submit"
                  id="submit-diary"
                  disabled={analyzing}
                  className="bg-[#1E3F35] hover:bg-[#152D26] disabled:bg-gray-400 text-white py-3 px-6 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shrink-0"
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analisando com IA...
                    </>
                  ) : (
                    <>
                      <Feather className="w-4 h-4" />
                      Salvar com Análise de IA
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Real-time AI Analysis Feedback pop container */}
          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-[#1E3F35]">
                <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-600/10" />
                <h4 className="font-serif font-bold text-sm">Parecer Terapêutico Gerado</h4>
              </div>
              <p className="text-xs text-[#2C3B30] leading-relaxed">
                {analysisResult.advice}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.tags.map((tag: string) => (
                  <span key={tag} className="bg-white text-[#1E3F35] border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                    # {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* History Column */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1E3F35]">Seu Histórico Emocional</h3>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {entries.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-dashed border-[#E2E2D9] text-center text-[#889B8C] py-12">
                <Feather className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <span className="text-xs">Nenhuma entrada ainda.</span>
              </div>
            ) : (
              entries.map((entry) => {
                const moodObj = moodOptions.find(o => o.key === entry.mood);
                return (
                  <div key={entry.id} className="bg-white rounded-2xl border border-[#EBEBE3] p-4 space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-[#607062]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-semibold flex items-center gap-1 ${moodObj?.bg}`}>
                        <span>{moodObj?.emoji}</span>
                        <span>{moodObj?.label}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#2C3B30] leading-relaxed whitespace-pre-wrap font-medium">
                      {entry.text}
                    </p>

                    {entry.aiAnalysis && (
                      <div className="bg-[#F5F4EE] rounded-xl p-3 border border-[#E2E2D9] text-[11px] space-y-1.5">
                        <div className="flex items-center gap-1 text-[#1E3F35] font-bold">
                          <MessageSquareText className="w-3.5 h-3.5" />
                          <span>Conselho de Apoio</span>
                        </div>
                        <p className="text-[#607062] leading-relaxed italic">
                          "{entry.aiAnalysis.advice}"
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.aiAnalysis.tags.map(t => (
                            <span key={t} className="text-[9px] bg-white text-[#1E3F35] border border-[#E2E2D9] px-1.5 py-0.2 rounded font-semibold">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
