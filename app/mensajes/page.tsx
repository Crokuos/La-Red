"use client";
import { useState } from "react";
import Link from "next/link"; // Importación vital

const CHATS_ACTIVOS = [
  { id: 1, nombre: "Valentina", foto: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", ultimoMsg: "Dale, a las 11 en el bar.", hora: "12:45", sinLeer: 2 },
  { id: 2, nombre: "Mateo", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80", ultimoMsg: "Viste el set que subieron?", hora: "Ayer", sinLeer: 0 },
];

const NUEVOS_MATCHES = [
  { id: 3, nombre: "Camila", foto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80" },
  { id: 4, nombre: "Lucía", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80" },
  { id: 5, nombre: "Enzo", foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80" },
];

export default function Mensajes() {
  return (
    <main className="min-h-screen bg-black text-white pb-24 max-w-md mx-auto border-x border-gray-900 shadow-2xl">
      
      <header className="p-6 border-b border-gray-900 sticky top-0 bg-black/90 backdrop-blur-md z-50 flex justify-between items-center">
        <h1 className="text-xl font-black italic uppercase tracking-widest">Mensajes</h1>
        <button className="text-red-accent text-[10px] font-black border border-red-accent/30 px-3 py-1 rounded-full bg-red-accent/5 tracking-tighter">
            EN LÍNEA
        </button>
      </header>

      <section className="p-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Nuevas Conexiones</h2>
        <div className="flex gap-5 overflow-x-auto no-scrollbar">
          {NUEVOS_MATCHES.map(m => (
            <div key={m.id} className="flex flex-col items-center gap-2 min-w-[70px] group cursor-pointer">
              <div className="w-16 h-16 rounded-3xl rotate-3 group-hover:rotate-0 transition-all border-2 border-red-accent p-0.5 overflow-hidden">
                <img src={m.foto} className="w-full h-full object-cover rounded-[1.4rem]" alt="" />
              </div>
              <span className="text-[10px] font-bold text-gray-400">{m.nombre}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-2 space-y-1">
        <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Conversaciones</h2>
        {CHATS_ACTIVOS.map(chat => (
            <Link href={`/mensajes/${chat.id}`} key={chat.id}>
          <div key={chat.id} className="flex items-center gap-4 p-4 hover:bg-gray-900/40 transition-all rounded-[2rem] cursor-pointer group">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-gray-800">
                  <img src={chat.foto} className="w-full h-full object-cover" alt="" />
                </div>
                {chat.sinLeer > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-accent w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black animate-pulse">
                    {chat.sinLeer}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-black italic uppercase text-sm tracking-tighter">{chat.nombre}</h3>
                  <span className="text-[9px] text-gray-600 font-bold">{chat.hora}</span>
                </div>
                <p className={`text-xs truncate ${chat.sinLeer > 0 ? "text-white font-medium" : "text-gray-500"}`}>
                  {chat.ultimoMsg}
                </p>
              </div>
          </div>
          </Link>
        ))}
      </section>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/80 backdrop-blur-2xl border-t border-white/5 px-12 py-5 flex justify-between items-center z-50">
        <Link href="/dashboard" className="text-gray-600 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        </Link>
        <Link href="/mensajes" className="text-red-accent">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </Link>
        <Link href="/perfil" className="text-gray-600 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="7" r="4"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/></svg>
        </Link>
      </nav>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}