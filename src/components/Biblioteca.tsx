import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Clock, ArrowUpRight, Compass, Sparkles, Filter } from 'lucide-react';

export default function Biblioteca() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todos');

  const articles = [
    {
      id: 1,
      title: 'O Ritmo Circadiano e a Cura Biológica',
      category: 'Regulação',
      tag: 'Ciclos',
      summary: 'Descubra como os fotorreceptores nos seus olhos guiam a secreção de melatonina e cortisol, e como dormir antes das 22h potencializa a renovação celular.',
      readTime: '6 min de leitura',
      content: 'A regulação circadiana é a base invisível de toda cura celular. Nosso relógio biológico central é sincronizado diretamente pelo espectro de luz natural.'
    },
    {
      id: 2,
      title: 'Nutrição de Ouro: Como Combater a Inflamação Silenciosa',
      category: 'Nutrição',
      tag: 'Anti-inflamação',
      summary: 'Dores crônicas e fadiga excessiva frequentemente resultam de citocinas pró-inflamatórias. Saiba quais gorduras boas desarmam esse mecanismo.',
      readTime: '8 min de leitura',
      content: 'A inflamação crônica de baixo grau atua como um dreno constante de energia mitocondrial, provocando dores erráticas e fadiga inexplicável.'
    },
    {
      id: 3,
      title: 'Mecanismos Somáticos: A Respiração como Chave do Vago',
      category: 'Soma',
      tag: 'Respiração',
      summary: 'A técnica respiratória diafragmática ativa o nervo vago, reduzindo a frequência cardíaca e atenuando surtos de estresse agudo em menos de 3 minutos.',
      readTime: '5 min de leitura',
      content: 'Ao prolongar a expiração, você envia um sinal biofísico ao cérebro indicando que o ambiente está seguro, ativando instantaneamente o parassimpático.'
    },
    {
      id: 4,
      title: 'Saúde Mitocondrial: A Usina de Energia da Vida',
      category: 'Ciência',
      tag: 'Energia',
      summary: 'Como a coenzima Q10, o magnésio e o jejum intermitente fisiológico cooperam para elevar os níveis de ATP mitocondrial, banindo a fadiga crônica.',
      readTime: '7 min de leitura',
      content: 'As mitocôndrias governam nossa vitalidade. Nutri-las com micronutrientes específicos acelera significativamente os processos regenerativos do corpo.'
    }
  ];

  const tags = ['Todos', 'Ciclos', 'Anti-inflamação', 'Respiração', 'Energia'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'Todos' || article.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div id="biblioteca-section" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Search and Tag Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[#EBEBE3] pb-5">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#889B8C]" />
          <input
            id="biblioteca-search"
            type="text"
            placeholder="Buscar artigos ou temas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E2D9] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#1E3F35] text-[#2C3B30]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {tags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${selectedTag === tag ? 'bg-[#1E3F35] text-white' : 'bg-[#F5F4EE] border border-[#E2E2D9] text-[#607062] hover:text-[#1E3F35]'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-[#E2E2D9] text-center text-[#889B8C] md:col-span-2">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50 text-[#1E3F35]" />
            <span className="text-xs">Nenhum recurso educacional encontrado com as especificações inseridas.</span>
          </div>
        ) : (
          filteredArticles.map(article => (
            <div 
              key={article.id} 
              className="bg-white rounded-3xl border border-[#EBEBE3] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-[#1E3F35]/5 text-[#1E3F35] border border-[#1E3F35]/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#889B8C]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-[#1E3F35] hover:underline cursor-pointer">
                  {article.title}
                </h4>

                <p className="text-xs text-[#607062] leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F0F0E9] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1E3F35]">RECURSO CONSOLIDADO</span>
                <button
                  type="button"
                  onClick={() => alert(`Artigo completo:\n\n${article.content}`)}
                  className="text-xs font-semibold text-[#1E3F35] flex items-center gap-1 hover:underline"
                >
                  Ler Artigo Completo
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
