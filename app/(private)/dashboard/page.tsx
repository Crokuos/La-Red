"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link"; // ESTA LÍNEA ES LA QUE FALTABA
import { getSessionUser } from "../../_lib/admissions";

const USUARIOS_DATA = [
  { id: 1, nombre: "Valentina", edad: 24, departamento: "Montevideo", barrio: "Pocitos", foto: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", tribus: ["Góticas/os", "Alt/Indie"], online: true },
  { id: 2, nombre: "Mateo", edad: 28, departamento: "Montevideo", barrio: "Cordón", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80", tribus: ["Metaleros", "Techneros"], online: true },
  { id: 3, nombre: "Camila", edad: 22, departamento: "Canelones", barrio: "Punta Carretas", foto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80", tribus: ["Sport", "Gym Rats"], online: false },
  { id: 4, nombre: "Damián", edad: 25, departamento: "Montevideo", barrio: "Centro", foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80", tribus: ["Daddies/Mommies", "Elegante"], online: true },
];

// Full lists for filters (kept here so modal always shows all options)
const DEPARTAMENTOS = [
  "Artigas",
  "Canelones",
  "Cerro Largo",
  "Colonia",
  "Durazno",
  "Flores",
  "Florida",
  "Lavalleja",
  "Maldonado",
  "Montevideo",
  "Paysandú",
  "Río Negro",
  "Rivera",
  "Rocha",
  "Salto",
  "San José",
  "Soriano",
  "Tacuarembó",
  "Treinta y Tres",
];

const TRIBUS = [
  "Metaleros",
  "Techneros",
  "Gym Rats",
  "Góticas/os",
  "Alt/Indie",
  "Sport",
  "Daddies/Mommies",
  "Elegante",
  "Skaters",
  "Hip-hop/Rap",
  "K-popers",
  "Gamers",
  "Artistas",
  "Hippie-Chic",
  "Rave Culture",
  "Aesthetic",
  "Trapperos",
  "Otakus",
  "Viejas Escuelas",
  "Fit-Style",
];
import { useRouter } from "next/navigation";
function MatchModal({ isOpen, onClose, user, userPhoto }: { 
  isOpen: boolean, onClose: () => void, user: any, userPhoto: string 
}) {
  const router = useRouter();
  const [showAnim, setShowAnim] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setShowAnim(false);
      setTimeout(() => setShowAnim(true), 80);
    }
  }, [isOpen]);
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className={`max-w-md w-full text-center px-6 animate-in zoom-in duration-300 ${showAnim ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.5s cubic-bezier(.2,.9,.2,1)' }}>
        <h2 className="text-7xl font-black italic text-red-accent tracking-tighter mb-2 drop-shadow-[0_0_25px_rgba(11,61,145,0.7)] animate-bounce">¡MATCH!</h2>
        <p className="text-gray-400 uppercase text-[10px] tracking-[0.4em] mb-12 animate-fade-in">¡Ahora pueden chatear!</p>
        <div className="relative flex justify-center items-center h-48 mb-16">
          <div className={`absolute w-36 h-36 rounded-2xl border-4 border-white overflow-hidden z-20 -rotate-12 shadow-2xl ${showAnim ? 'animate-[photo-swing-left_0.7s_ease-in-out]' : ''}` }>
            <img src={userPhoto} className="w-full h-full object-cover" alt="Tu" />
          </div>
          <div className={`absolute w-36 h-36 rounded-2xl border-4 border-red-accent overflow-hidden z-10 rotate-12 shadow-2xl ${showAnim ? 'animate-[photo-swing-right_0.7s_ease-in-out]' : ''}` }>
            <img src={user.foto} className="w-full h-full object-cover" alt="Match" />
          </div>
          {/* Efecto glow */}
          {showAnim && <div className="absolute w-44 h-44 rounded-full bg-red-accent/20 blur-2xl z-0 animate-pulse" />}
        </div>
        <button
          className="w-full bg-white text-black font-black py-4 rounded-full uppercase text-xs tracking-widest mb-4 shadow-lg hover:bg-gray-100 active:scale-95 transition-all animate-in fade-in"
          onClick={() => {
            router.push(`/mensajes?match=${user.id}`);
            onClose();
          }}
        >Enviar Mensaje</button>
        <button onClick={onClose} className="text-gray-500 font-bold py-2 uppercase text-[10px] tracking-widest hover:text-white">Seguir explorando</button>
      </div>
    </div>
  );
}
export default function Dashboard() {
  const router = useRouter();
  const MATCHES_KEY = "matches";
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("cerca");
  const [likes, setLikes] = useState<number[]>([]);
  const [likesInbox, setLikesInbox] = useState([
    { id: 5, nombre: "Lucía", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80" },
    { id: 6, nombre: "Enzo", foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80" },
  ]);
  const [storyAbierta, setStoryAbierta] = useState<string | null>(null);
  const [matchIds, setMatchIds] = useState<number[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportUser, setReportUser] = useState<any>(null);
  const [reportReason, setReportReason] = useState("");
  const dashReasons = ["Foto indevida", "Suplantacion de identidad"];
  const [reportedIds, setReportedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("todos");
  const [selectedTribu, setSelectedTribu] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchUser, setMatchUser] = useState<any>(null);
  // Historias (simulación)
  const [historias, setHistorias] = useState([
    { id: 1, foto: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", user: "Valentina", userId: 1 },
    { id: 2, foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80", user: "Mateo", userId: 2 },
  ]);
  const storyInputRef = useRef<HTMLInputElement>(null);

  // Cuando se selecciona 'Subir a Historia', simula agregar una historia
  // Sin efecto de publicación (FAB eliminado)
const toggleLike = (user: any) => {
  if (likes.includes(user.id)) {
    setLikes(likes.filter(i => i !== user.id));
  } else {
    setLikes([...likes, user.id]);
    // SIMULACIÓN: Si es Valentina o Mateo, salta el Match
    if (user.nombre === "Valentina" || user.nombre === "Mateo") {
      setMatchUser(user);
      setTimeout(() => setShowMatch(true), 400);
      persistMatch(user);
    }
  }
};

  const persistMatch = (user: any) => {
    setMatchIds(prev => prev.includes(user.id) ? prev : [...prev, user.id]);
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(MATCHES_KEY) : null;
      const parsed = saved ? JSON.parse(saved) : [];
      const exists = Array.isArray(parsed) && parsed.some((m: any) => m.id === user.id);
      const next = exists ? parsed : [...parsed, { id: user.id, nombre: user.nombre, foto: user.foto }];
      localStorage.setItem(MATCHES_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("No se pudo guardar el match", err);
    }
  };

  const acceptLike = (user: any) => {
    persistMatch(user);
    setLikesInbox(prev => prev.filter((p) => p.id !== user.id));
    setMatchUser(user);
    setTimeout(() => setShowMatch(true), 200);
  };

// Carga matches previos para habilitar mensajes desde dashboard o perfil
useEffect(() => {
  const session = getSessionUser();
  if (!session) {
    router.replace("/login");
    return;
  }
  setAuthChecked(true);
}, [router]);

useEffect(() => {
  try {
    const saved = typeof window !== "undefined" ? localStorage.getItem(MATCHES_KEY) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setMatchIds(parsed.map((m: any) => m.id));
      }
    }
  } catch (err) {
    console.error("No se pudo leer matches guardados", err);
  }
}, []);

// derive unique opciones
const departamentos = DEPARTAMENTOS;
const tribus = TRIBUS;

// debounce searchTerm -> search (300ms)
useEffect(() => {
  const t = setTimeout(() => setSearch(searchTerm), 300);
  return () => clearTimeout(t);
}, [searchTerm]);

const filtered = USUARIOS_DATA.filter(u => {
  if (selectedDepartamento !== "todos" && u.departamento !== selectedDepartamento) return false;
  if (selectedTribu.length > 0 && !u.tribus.some(t => selectedTribu.includes(t))) return false;
  if (search && !(`${u.nombre} ${u.barrio} ${u.tribus.join(' ')}`).toLowerCase().includes(search.toLowerCase())) return false;
  return true;
});

const filteredMatches = filtered.filter(u => matchIds.includes(u.id));
const currentList = activeTab === "tribus" ? filteredMatches : filtered;

const openReport = (user: any) => {
  if (reportedIds.includes(user.id)) return;
  setReportUser(user);
  setReportReason(dashReasons[0]);
  setReportOpen(true);
};

const submitReport = () => {
  alert(`Reporte enviado sobre ${reportUser?.nombre}`);
  if (reportUser) setReportedIds((prev) => [...prev, reportUser.id]);
  setReportOpen(false);
};

if (!authChecked) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Verificando acceso...</p>
    </div>
  );
}

return (
  <div className="min-h-screen bg-black text-white pb-24 max-w-md mx-auto border-x border-gray-900 shadow-2xl relative">
    {/* ESTO ES LO QUE TE FALTA PEGAR AQUÍ: */}
    <MatchModal 
      isOpen={showMatch} 
      onClose={() => setShowMatch(false)} 
      user={matchUser} 
      userPhoto="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80" 
    />

    {/* ABAJO SIGUE TU CÓDIGO DE STORY MODAL QUE YA TENÍAS: */}
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
            <div className="relative">
              <button
                onClick={() => setShowNotif((v) => !v)}
                className="relative"
                aria-label="Notificaciones"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                {(likesInbox.length > 0 || likes.length > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-accent text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {likesInbox.length || likes.length}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-3 w-72 bg-black/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-50 p-3 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold">Notificaciones</p>
                    <button
                      className="text-[11px] text-gray-400 hover:text-white"
                      onClick={() => setShowNotif(false)}
                    >
                      Cerrar
                    </button>
                  </div>

                  {likesInbox.length === 0 && (
                    <p className="text-xs text-gray-500">Sin likes nuevos.</p>
                  )}

                  {likesInbox.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
                      <img src={u.foto} alt={u.nombre} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{u.nombre}</p>
                        <p className="text-[11px] text-gray-500">te dio like</p>
                      </div>
                      <button
                        onClick={() => acceptLike(u)}
                        className="p-2 rounded-full bg-rose-500 text-white shadow-lg active:scale-95 transition"
                        aria-label="Hacer match"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
        {/* Tu historia con botón + */}
        <button
          onClick={() => storyInputRef.current?.click()}
          className="flex flex-col items-center gap-2 min-w-[70px]"
        >
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-red-accent/70 p-0.5 flex items-center justify-center bg-white/5">
            <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center text-red-accent text-2xl font-bold">+</div>
            <div className="absolute -bottom-1 right-0 bg-red-accent text-black text-[10px] font-black px-2 py-0.5 rounded-full">Tú</div>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Tu historia</span>
        </button>
        <input
          ref={storyInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            setHistorias(prev => [
              { id: Date.now(), foto: url, user: "Tú", userId: 0 },
              ...prev,
            ]);
          }}
        />

        {/* Historias solo de matches */}
        {historias.filter(h => h.userId === 0 || matchIds.includes(h.userId)).map(h => (
          <button key={h.id} onClick={() => setStoryAbierta(h.foto)} className="flex flex-col items-center gap-2 min-w-[70px]">
            <div className={`w-16 h-16 rounded-full border-2 p-0.5 transition-all ${h.userId === 0 ? "border-red-accent" : "border-red-accent shadow-[0_0_12px_rgba(139,92,246,0.4)]"}`}>
              <img src={h.foto} className="w-full h-full rounded-full object-cover" alt="" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{h.user}</span>
          </button>
        ))}
      </section>

      {/* TOOLBAR: buscador y botón de filtros (abre modal) */}
      <div className="px-5 mt-2 mb-4 flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <input
            aria-label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar nombre, barrio o tribu..."
            className="flex-1 bg-white/5 border border-white/5 rounded-full px-4 py-2 text-sm placeholder-gray-400 text-white"
          />
          <button
            onClick={() => setShowFilters(true)}
            className="ml-2 bg-white/5 border border-white/5 text-white px-4 py-2 rounded-full text-sm"
            aria-haspopup="dialog"
          >
            Filtros
          </button>
        </div>
        <div className="flex gap-2 text-xs text-gray-400">
          <button onClick={() => { setSelectedDepartamento('todos'); setSelectedTribu([]); setSearch(''); }} className="underline">Limpiar filtros</button>
          <div className="ml-auto">Mostrando {currentList.length} de {USUARIOS_DATA.length}</div>
        </div>
      </div>

      {/* FILTERS MODAL */}
      {showFilters && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowFilters(false)} />
          <div className="relative z-70 w-full max-w-2xl mx-4 p-6 bg-gray-900 rounded-2xl text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Filtros</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Departamento</label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="departamento" checked={selectedDepartamento === 'todos'} onChange={() => setSelectedDepartamento('todos')} />
                    <span className="ml-2">Todos los departamentos</span>
                  </label>
                  {departamentos.map(d => (
                    <label key={d} className="flex items-center gap-2 text-sm">
                      <input type="radio" name="departamento" checked={selectedDepartamento === d} onChange={() => setSelectedDepartamento(d)} />
                      <span className="ml-2">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tribus (multiselección)</label>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                  {tribus.map(t => (
                    <label key={t} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={selectedTribu.includes(t)} onChange={() => {
                        setSelectedTribu(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
                      }} />
                      <span className="ml-2">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setSelectedDepartamento('todos'); setSelectedTribu([]); }} className="px-4 py-2 rounded-full bg-white/5">Limpiar</button>
              <button onClick={() => setShowFilters(false)} className="px-4 py-2 rounded-full bg-red-accent text-black font-bold">Aplicar</button>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <nav className="flex px-8 mb-6 gap-8">
        <button onClick={() => setActiveTab("cerca")} className={`pb-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'cerca' ? "text-white border-b-2 border-red-accent" : "text-gray-600"}`}>Explorar</button>
        <button onClick={() => setActiveTab("tribus")} className={`pb-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'tribus' ? "text-white border-b-2 border-red-accent" : "text-gray-600"}`}>Matches</button>
      </nav>

      {/* FEED DE PERFILES */}
      <section className="px-5 space-y-8">
        {currentList.map(u => (
            <div key={u.id} className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group">
                    <button
                      onClick={() => openReport(u)}
                      className="absolute top-4 right-4 z-20 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/20 hover:border-rose-400"
                      aria-label="Denunciar"
                    >
                      !
                    </button>
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
                      onClick={() => toggleLike(u)}
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

      {/* ...existing code... */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {reportOpen && reportUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[250] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-400 font-bold">Denunciar</p>
                <h3 className="text-lg font-black">{reportUser.nombre}</h3>
              </div>
              <button onClick={() => setReportOpen(false)} className="text-gray-400 hover:text-white">×</button>
            </div>
            <div className="space-y-2 mb-6">
              <label className="text-sm text-gray-300 font-semibold">Motivo</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-rose-400"
              >
                {dashReasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 mb-6">
              <label className="text-sm text-gray-500 font-semibold">No se admite mensaje en esta denuncia.</label>
              <div className="w-full bg-black/30 border border-white/5 rounded-xl p-3 text-sm text-gray-500 italic">
                Selecciona el motivo y envía.
              </div>
            </div>
            <button
              onClick={submitReport}
              disabled={!reportReason}
              className="w-full bg-rose-500 text-black font-black uppercase tracking-[0.2em] py-3 rounded-full active:scale-95 transition disabled:opacity-40"
            >
              Enviar reporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}