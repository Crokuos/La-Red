"use client";
import { useState } from "react";
import Link from "next/link"; // ESTA LÍNEA ES LA QUE FALTABA

const USUARIOS_DATA = [
  { id: 1, nombre: "Valentina", edad: 24, barrio: "Pocitos", foto: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", tribus: ["Góticas/os", "Alt/Indie"], online: true },
  { id: 2, nombre: "Mateo", edad: 28, barrio: "Cordón", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80", tribus: ["Metaleros", "Techneros"], online: true },
  { id: 3, nombre: "Camila", edad: 22, barrio: "Punta Carretas", foto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80", tribus: ["Sport", "Gym Rats"], online: false },
  { id: 4, nombre: "Damián", edad: 25, barrio: "Centro", foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80", tribus: ["Daddies/Mommies", "Elegante"], online: true },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("cerca");
  const [likes, setLikes] = useState<number[]>([]);
  const [storyAbierta, setStoryAbierta] = useState<string | null>(null);

  const toggleLike = (id: number) => {
    if (likes.includes(id)) {
      setLikes(likes.filter(i => i !== id));
    } else {
      setLikes([...likes, id]);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pb-24 max-w-md mx-auto border-x border-gray-900 shadow-2xl relative">
      
      {/* MODAL DE STORY */}
      {storyAbierta && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in zoom-in duration-200">
          <button onClick={() => setStoryAbierta(null)} className="absolute top-10 right-6 text-white text-4xl font-light">&times;</button>
          <img src={storyAbierta} className="w-full max-h-[80vh] object-contain px-4" alt="Story" />
        </div>
      )}

      {/* HEADER */}
      <header className="p-6 flex justify-between items-center border-b border-gray-900 sticky top-0 bg-black/95 backdrop-blur-md z-50">
        <h1 className="text-2xl font-black italic tracking-tighter text-red-accent">LA RED</h1>
        <div className="flex gap-4">
            <button className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                {likes.length > 0 && <span className="absolute top-0 right-0 bg-red-accent w-2 h-2 rounded-full"></span>}
            </button>
            {/* BOTÓN PERFIL ARRIBA */}
            <Link href="/perfil">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-accent/40 to-gray-800 border border-white/10 flex items-center justify-center text-[10px] font-bold tracking-tighter cursor-pointer active:scale-90 transition-transform">
                    YO
                </div>
            </Link>
        </div>
      </header>

      {/* STORIES */}
      <section className="p-4 overflow-x-auto flex gap-4 no-scrollbar">
        {USUARIOS_DATA.map(u => (
            <button key={u.id} onClick={() => setStoryAbierta(u.foto)} className="flex flex-col items-center gap-2 min-w-[70px]">
                <div className={`w-16 h-16 rounded-full border-2 p-0.5 transition-all ${u.online ? "border-red-accent shadow-[0_0_12px_rgba(139,92,246,0.4)]" : "border-gray-800"}`}>
                    <img src={u.foto} className="w-full h-full rounded-full object-cover" alt="" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{u.nombre}</span>
            </button>
        ))}
      </section>

      {/* TABS */}
      <nav className="flex px-8 mb-6 gap-8">
        <button onClick={() => setActiveTab("cerca")} className={`pb-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'cerca' ? "text-white border-b-2 border-red-accent" : "text-gray-600"}`}>Explorar</button>
        <button onClick={() => setActiveTab("tribus")} className={`pb-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'tribus' ? "text-white border-b-2 border-red-accent" : "text-gray-600"}`}>Matches</button>
      </nav>

      {/* FEED DE PERFILES */}
      <section className="px-5 space-y-8">
        {USUARIOS_DATA.map(u => (
            <div key={u.id} className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group">
                    <img src={u.foto} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{u.nombre}, {u.edad}</h3>
                            {u.online && <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>}
                        </div>
                        <p className="text-gray-400 text-[11px] mb-4 font-bold uppercase tracking-[0.2em]">{u.barrio}</p>
                        <div className="flex flex-wrap gap-2">
                            {u.tribus.map(t => (
                                <span key={t} className="bg-black/40 backdrop-blur-xl text-[9px] px-3 py-1 rounded-full uppercase font-black border border-white/10 tracking-tighter">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button 
                      onClick={() => toggleLike(u.id)}
                      className={`absolute bottom-4 right-4 p-5 rounded-full shadow-2xl active:scale-50 transition-all duration-300 ${
                        likes.includes(u.id) 
                        ? "bg-red-accent scale-110" 
                        : "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
                      }`}
                    >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="26" 
                          height="26" 
                          viewBox="0 0 24 24" 
                          fill={likes.includes(u.id) ? "white" : "none"} 
                          stroke={likes.includes(u.id) ? "white" : "currentColor"} 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className={likes.includes(u.id) ? "animate-bounce" : ""}
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        ))}
      </section>

      {/* NAV INFERIOR CON LINKS FUNCIONALES */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/80 backdrop-blur-2xl border-t border-white/5 px-12 py-5 flex justify-between items-center z-50">
        
        {/* Home Activo */}
        <Link href="/dashboard" className="text-red-accent">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </Link>

        {/* Mensajes */}
        <Link href="/mensajes" className="text-gray-600 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </Link>

        {/* Perfil */}
        <Link href="/perfil" className="text-gray-600 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="7" r="4"/>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          </svg>
        </Link>
      </nav>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </main>
  );
}