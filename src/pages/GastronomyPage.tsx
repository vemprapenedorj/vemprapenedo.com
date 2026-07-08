import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { DetailItem } from '../types';
import { DETAILS_DATA } from '../data/detailsData';
import { SearchPromo } from '../components/SearchPromo';
import { InfoCard } from '../components/InfoCard';
import { pushSearch } from '../analytics/events';

export function GastronomyPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = DETAILS_DATA['gastronomia'].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aPremium = (a as any).is_premium || a.isPremium ? 1 : 0;
    const bPremium = (b as any).is_premium || b.isPremium ? 1 : 0;
    if (aPremium !== bPremium) return bPremium - aPremium;
    return a.title.localeCompare(b.title);
  });

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      pushSearch(searchQuery, filteredItems.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredItems.length]);

  return (
    <div>
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={onGoBack} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Navegando: <span className="text-penedo-forest">Gastronomia</span>
          </div>
        </div>
      </div>

      <header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1920&h=1080" className="w-full h-full object-cover" alt="Gastronomia" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Gastronomia em <span className="text-penedo-gold">Penedo</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">Uma jornada gastronômica que une fondues aconchegantes, trutas frescas e o legado dos imigrantes finlandeses. Sabores inesquecíveis esperam por você.</p>
        </div>
      </header>

      <SearchPromo query={searchQuery} onSearch={setSearchQuery} minimal={true} />

      <section className="py-10 md:py-24 max-w-7xl mx-auto px-4">

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredItems.map((item) => (
              <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-20">
            <p className="text-gray-500 text-xl">Nenhum resultado encontrado para "{searchQuery}"</p>
          </div>
        )}
      </section>
    </div>
  );
}
