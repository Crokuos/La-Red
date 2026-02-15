import Link from 'next/link';

export default function Home() {

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      {/* Glow de fondo */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-red-accent/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-6xl font-black tracking-tighter mb-4 italic">
          LA RED
        </h1>

        <p className="text-gray-400 max-w-md text-lg mb-8">
          En Uruguay todos se conocen, pero pocos se encuentran. <br />
          <span className="text-red-accent font-semibold italic">Entrá si te dejan.</span>
        </p>

        <Link href="/registro" className="w-full">
          <button className="bg-white text-black font-bold py-4 rounded-full w-full hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer">
            SOLICITAR ACCESO
          </button>
        </Link>

        <Link href="/login" className="w-full mt-4 flex justify-center">
          <button className="text-gray-500 text-sm font-medium hover:text-white transition-colors cursor-pointer">
            Ya soy miembro (Login)
          </button>
        </Link>
      </div>

      <footer className="absolute bottom-8 text-xs text-gray-600 tracking-widest uppercase">
        Montevideo • Punta del Este
      </footer>
    </main>
  );
}