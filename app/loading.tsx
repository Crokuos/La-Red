"use client"; // ESTA LÍNEA ES LA QUE SOLUCIONA EL ERROR

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      
      {/* LOGO PARPADEANTE */}
      <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-red-accent animate-pulse-fast mb-8">
        LA RED
      </h1>

      {/* TEXTO DE CARGA */}
      <p className="text-sm md:text-base text-gray-500 font-bold uppercase tracking-[0.4em] animate-fade-in">
        Conectando...
      </p>

      {/* ESTILOS KEYFRAMES */}
      <style jsx global>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.03); }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-pulse-fast {
          animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}