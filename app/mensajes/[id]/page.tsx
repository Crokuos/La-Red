"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ChatIndividual({ params }: { params: { id: string } }) {
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([
    { id: 1, texto: "¡Hola! Vi que te gustan los Redondos 🎸", yo: false, hora: "12:40" },
    { id: 2, texto: "Sabelo, de las mejores bandas de acá.", yo: true, hora: "12:42" },
    { id: 3, texto: "¿Vas al toque del sábado?", yo: false, hora: "12:43" },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historial]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const nuevoMsg = {
      id: Date.now(),
      texto: mensaje,
      yo: true,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistorial([...historial, nuevoMsg]);
    setMensaje("");
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white max-w-md mx-auto border-x border-gray-900 shadow-2xl relative">
      
      {/* HEADER */}
      <header className="p-4 border-b border-gray-900 bg-black/95 backdrop-blur-md flex items-center gap-4 sticky top-0 z-50">
        <Link href="/mensajes" className="text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="w-10 h-10 rounded-2xl border border-red-accent/50 p-0.5">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80" 
            className="w-full h-full object-cover rounded-[0.9rem]" 
            alt="User" 
          />
        </div>
        <div>
          <h2 className="text-sm font-black italic uppercase tracking-tighter">Valentina</h2>
          <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest animate-pulse">En línea</span>
        </div>
      </header>

      {/* ÁREA DE MENSAJES */}
      <section 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-black scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {historial.map((msg) => (
          <div key={msg.id} className={`flex ${msg.yo ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm shadow-xl ${
              msg.yo 
              ? "bg-red-accent text-white rounded-tr-none" 
              : "bg-gray-900 text-gray-200 rounded-tl-none border border-gray-800"
            }`}>
              <p className="leading-relaxed font-medium">{msg.texto}</p>
              <span className={`text-[8px] mt-1 block opacity-50 font-black ${msg.yo ? "text-right" : "text-left"}`}>
                {msg.hora}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* INPUT */}
      <footer className="p-4 bg-black border-t border-gray-900 sticky bottom-0">
        <form onSubmit={enviarMensaje} className="flex gap-2 items-center">
          <input 
            type="text" 
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribí un mensaje..." 
            className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-red-accent/50 transition-all text-white placeholder:text-gray-600"
          />
          <button 
            type="submit"
            className="bg-red-accent p-3 rounded-full active:scale-90 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
      </footer>

    </main>
  );
}