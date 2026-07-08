const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const injectNav = (pageName, label) => {
  const funcRegex = new RegExp(`(function ${pageName}\\(.*?\\)[\\s\\S]*?)(<header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">)`);
  
  const navHTML = `
      <div className="sticky top-[80px] lg:top-20 z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={onGoBack} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Navegando: <span className="text-penedo-forest">${label}</span>
          </div>
        </div>
      </div>\n      `;
      
  content = content.replace(funcRegex, `$1${navHTML}$2`);
};

injectNav('WhatToDoPage', 'O Que Fazer');
injectNav('WhereToStayPage', 'Onde Ficar');
injectNav('GastronomyPage', 'Gastronomia');
injectNav('ShoppingPage', 'Compras');

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated with sticky nav');
