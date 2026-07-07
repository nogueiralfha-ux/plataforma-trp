import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Message, UserProfile } from '../types';
import { Sparkles, Send, Moon, BrainCircuit, Droplet, Dumbbell, ShieldCheck } from 'lucide-react';

interface IaChatProps {
  user: UserProfile;
  messages: Message[];
  onSendMessage: (text: string) => void;
  loading: boolean;
}

export default function IaChat({ user, messages, onSendMessage, loading }: IaChatProps) {
  const [inputText, setInputText] = useState('');

  const chips = [
    { text: 'Como regular o sono?', icon: <Moon className="w-3.5 h-3.5" /> },
    { text: 'O que comer para desinflamar?', icon: <Droplet className="w-3.5 h-3.5 text-blue-500" /> },
    { text: 'Técnicas contra ansiedade', icon: <BrainCircuit className="w-3.5 h-3.5 text-emerald-500" /> },
    { text: 'Dores musculares e reabilitação', icon: <Dumbbell className="w-3.5 h-3.5 text-rose-500" /> }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const selectChip = (text: string) => {
    if (loading) return;
    onSendMessage(text);
  };

  return (
    <div id="ia-chat-container" className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[520px]">
      
      {/* Messages Window wrapper */}
      <div className="flex-1 bg-white rounded-3xl border border-[#EBEBE3] shadow-sm flex flex-col justify-between overflow-hidden">
        
        {/* Chat header info */}
        <div className="bg-[#FAFBF9] border-b border-[#F0F0E9] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E3F35] text-white flex items-center justify-center shadow-md shadow-[#1E3F35]/15">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#1E3F35]">Mentor Terapêutico TRP</h4>
              <p className="text-[10px] text-[#607062] font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Assistente Virtual Ativo
              </p>
            </div>
          </div>

          <span className="text-[10px] font-semibold bg-[#1E3F35]/5 text-[#1E3F35] px-2.5 py-1 rounded-full border border-[#1E3F35]/10">
            GEMINI 3.5 FLASH
          </span>
        </div>

        {/* Messaging window */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[340px]">
          {messages.length === 0 ? (
            <div className="text-center py-10 max-w-sm mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F5F4EE] border border-[#E2E2D9] flex items-center justify-center text-[#889B8C] mx-auto">
                <Sparkles className="w-6 h-6 text-[#1E3F35]" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#1E3F35]">Seu Espaço de Consulta Diária</h4>
              <p className="text-xs text-[#607062] leading-relaxed">
                Tire dúvidas sobre seu plano alimentar, regulação do ciclo vigília-sono, controle emocional somático ou andamento de exercícios de mobilidade.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={index} className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}>
                  {isAi && (
                    <div className="w-8 h-8 rounded-lg bg-[#1E3F35] text-white flex items-center justify-center text-xs shrink-0 font-bold shadow-sm">
                      ✨
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl max-w-[75%] text-xs leading-relaxed ${isAi ? 'bg-[#FAFBF9] border border-[#EBEBE3] text-[#2C3B30]' : 'bg-[#1E3F35] text-white'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[8px] mt-1.5 block ${isAi ? 'text-[#889B8C]' : 'text-white/60'} text-right font-semibold`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-lg bg-[#F5F4EE] border border-[#E2E2D9] flex items-center justify-center text-sm shrink-0 font-bold">
                      {user.avatar}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#1E3F35] text-white flex items-center justify-center text-xs shrink-0 font-bold">
                ✨
              </div>
              <div className="bg-[#FAFBF9] border border-[#EBEBE3] p-4 rounded-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1E3F35] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-[#1E3F35] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-[#1E3F35] rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Preset suggestions chips */}
        <div className="px-5 py-2 overflow-x-auto flex gap-2 border-t border-[#F0F0E9] bg-[#FAFBF9] shrink-0 scrollbar-none">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectChip(chip.text)}
              className="py-1.5 px-3 bg-white hover:bg-[#F5F4EE] border border-[#E2E2D9] rounded-xl text-[10px] font-bold text-[#1E3F35] flex items-center gap-1.5 shrink-0 transition-all shadow-xs"
            >
              {chip.icon}
              {chip.text}
            </button>
          ))}
        </div>

        {/* Action input bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#F0F0E9] flex gap-2 shrink-0">
          <input
            id="ia-chat-message-input"
            type="text"
            required
            placeholder="Digite sua dúvida ou relato de bem-estar..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-[#FBFBFA] border border-[#E2E2D9] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#1E3F35] text-[#2C3B30]"
          />
          <button
            type="submit"
            id="send-chat"
            disabled={loading || !inputText.trim()}
            className="bg-[#1E3F35] hover:bg-[#152D26] disabled:bg-gray-300 text-white p-3 rounded-xl transition-all shadow-md flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
