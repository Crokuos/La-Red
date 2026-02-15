"use client";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchName: string;
  matchImage: string;
  userImage: string;
}

export default function MatchModal({ isOpen, onClose, matchName, matchImage, userImage }: MatchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md match-overlay-enter">
      <div className="max-w-md w-full text-center px-6">
        
        {/* TÍTULO IMPACTANTE */}
        <h2 className="text-6xl font-black italic text-pink-neon tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,0,127,0.5)]">
          ¡CONEXIÓN!
        </h2>
        <p className="text-gray-400 uppercase text-[10px] tracking-[0.4em] mb-12">
          Entraste en la red de {matchName}
        </p>

        {/* LAS FOTOS CRUZADAS (Usando tus animaciones de globals.css) */}
        <div className="relative flex justify-center items-center h-48 mb-16">
          <div className="absolute w-36 h-36 rounded-2xl border-4 border-white overflow-hidden z-20 photo-left-anim shadow-2xl">
            <img src={userImage} className="w-full h-full object-cover" alt="Tu foto" />
          </div>
          <div className="absolute w-36 h-36 rounded-2xl border-4 border-brand-blue overflow-hidden z-10 photo-right-anim shadow-2xl">
            <img src={matchImage} className="w-full h-full object-cover" alt="Match" />
          </div>
        </div>

        {/* ACCIONES */}
        <div className="space-y-4">
          <button className="w-full bg-white text-black font-black py-4 rounded-full uppercase text-xs tracking-widest hover:scale-105 transition-transform btn-glow">
            Enviar Mensaje Directo
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-transparent text-gray-500 font-bold py-2 rounded-full uppercase text-[10px] tracking-widest hover:text-white"
          >
            Seguir explorando
          </button>
        </div>

      </div>
    </div>
  );
}