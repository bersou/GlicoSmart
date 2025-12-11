import React from 'react';

interface IntroProps {
  onStart: () => void;
}

function Intro({ onStart }: IntroProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6 text-white z-50">
      
      {/* Área do Logo com Animação de Pulso */}
      <div className="mb-8 relative flex items-center justify-center">
        {/* Círculo decorativo brilhante atrás */}
        <div className="absolute w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-30"></div>
        
        {/* O Ícone Oficial (Puxando direto da pasta public) */}
        <img 
          src="/icon.png" 
          alt="GlicoSmart Logo" 
          className="w-24 h-24 rounded-2xl shadow-2xl relative z-10"
        />
      </div>

      {/* Textos - Tipografia Moderna */}
      <h1 className="text-4xl font-bold mb-2 tracking-tight">
        GlicoSmart
      </h1>
      <p className="text-blue-100 text-center text-lg mb-12 max-w-xs leading-relaxed">
        Seu controle de glicemia inteligente, simples e conectado.
      </p>

      {/* Botão Começar */}
      <button
        onClick={onStart}
        className="w-full max-w-xs bg-white text-blue-700 font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
      >
        Começar
        {/* Ícone de seta simples (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Rodapé Discreto */}
      <div className="absolute bottom-6 text-blue-300 text-xs">
        Versão 1.2.0
      </div>
    </div>
  );
}

export default Intro;