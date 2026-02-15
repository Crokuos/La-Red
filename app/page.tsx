"use client";
import Link from "next/link";

export default function Landing() {
  return (
    // Modificación aquí: cambié 'bg-black' por un degradado lineal azul oscuro a negro
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* CÍRCULOS DE LUZ DE FONDO (Sutiles para dar profundidad) */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-red-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-red-accent/5 rounded-full blur-[120px]" />

      {/* CONTENEDOR PRINCIPAL - El max-w-md evita que se deforme en PC */}
      <div className="max-w-md w-full text-center z-10 space-y-12">
        
        {/* LOGOTIPO */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter text-white">
            LA <span className="text-red-accent italic">RED</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-gray-800"></span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
              Uruguay Exclusive
            </p>
            <span className="h-[1px] w-8 bg-gray-800"></span>
          </div>
        </div>

        {/* SLOGAN */}
        <div className="space-y-4 px-4">
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
            En Uruguay todos se conocen, <br /> 
            <span className="text-white">pero pocos se encuentran.</span>
          </p>
          <p className="text-red-accent text-[11px] font-black uppercase tracking-widest italic animate-pulse">
            Entrá si te dejan.
          </p>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex flex-col gap-4 px-6 pt-8">
          <Link href="/registro" className="w-full">
            <button className="w-full bg-white text-black font-black py-4 rounded-full text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all">
              Solicitar Acceso
            </button>
          </Link>
          
          <Link href="/login" className="w-full">
            <button className="w-full bg-transparent text-gray-400 font-bold py-2 text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">
              Ya soy miembro (Login)
            </button>
          </Link>
        </div>

      </div>

      {/* FOOTER CIUDADES */}
      <footer className="absolute bottom-8 w-full text-center">
        <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em]">
          Montevideo • Punta del Este • Colonia
        </p>
      </footer>

    </main>
  );
}