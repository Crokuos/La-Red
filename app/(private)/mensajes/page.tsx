"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // Importación vital

type MatchUser = { id: number; nombre: string; foto?: string };
const MATCHES_KEY = "matches";

export default function Mensajes() {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportUser, setReportUser] = useState<MatchUser | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportedIds, setReportedIds] = useState<number[]>([]);

  const reasons = [
    "Spam o contenido no deseado",
    "Lenguaje ofensivo",
    "Suplantación de identidad",
    "Comportamiento inapropiado",
    "Otro",
  ];

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(MATCHES_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMatches(parsed);
        }
      }
    } catch (err) {
      console.error("No se pudieron cargar matches", err);
    }
  }, []);

  const hasMatches = matches.length > 0;

  const openReport = (user: MatchUser) => {
    if (reportedIds.includes(user.id)) return;
    setReportUser(user);
    setReportReason("");
    setReportMessage("");
    setReportOpen(true);
  };

  const submitReport = () => {
    // Aquí podrías enviar a API; dejamos alert para demo.
    alert(`Reporte enviado sobre ${reportUser?.nombre}`);
    if (reportUser) {
      setReportedIds((prev) => [...prev, reportUser.id]);
    }
    setReportOpen(false);
  };

  return (
    <main className="min-h-screen bg-black text-white pb-24 max-w-md mx-auto border-x border-gray-900 shadow-2xl">
      
      <header className="p-6 border-b border-gray-900 sticky top-0 bg-black/90 backdrop-blur-md z-50 flex justify-between items-center">
        <h1 className="text-xl font-black italic uppercase tracking-widest">Mensajes</h1>
        <button className="text-red-accent text-[10px] font-black border border-red-accent/30 px-3 py-1 rounded-full bg-red-accent/5 tracking-tighter">
            EN LÍNEA
        </button>
      </header>

      {hasMatches ? (
        <>
          <section className="p-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Nuevas Conexiones</h2>
            <div className="flex gap-5 overflow-x-auto no-scrollbar">
              {matches.map(m => (
                <div key={m.id} className="flex flex-col items-center gap-2 min-w-[70px] group cursor-pointer">
                  <div className="w-16 h-16 rounded-3xl rotate-3 group-hover:rotate-0 transition-all border-2 border-red-accent p-0.5 overflow-hidden">
                    <img src={m.foto || "https://via.placeholder.com/64"} className="w-full h-full object-cover rounded-[1.4rem]" alt={m.nombre} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{m.nombre}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="px-2 space-y-1">
            <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Conversaciones</h2>
            {matches.map(chat => (
              <div key={chat.id} className="flex items-center gap-3 p-4 hover:bg-gray-900/40 transition-all rounded-[2rem]">
                <Link href={`/mensajes/${chat.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all border border-gray-800">
                      <img src={chat.foto || "https://via.placeholder.com/72"} className="w-full h-full object-cover" alt={chat.nombre} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-black italic uppercase text-sm tracking-tighter">{chat.nombre}</h3>
                      <span className="text-[9px] text-gray-600 font-bold">Nuevo</span>
                    </div>
                    <p className="text-xs truncate text-gray-500">¡Comienza la conversación!</p>
                  </div>
                </Link>
                <button
                  className="text-gray-500 hover:text-white transition p-2 disabled:opacity-40"
                  aria-label="Denunciar"
                  onClick={() => openReport(chat)}
                  disabled={reportedIds.includes(chat.id)}
                >
                  !
                </button>
              </div>
            ))}
          </section>
        </>
      ) : (
        <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-4">
          <div className="w-20 h-20 rounded-full bg-red-accent/10 border border-red-accent/30 flex items-center justify-center">
            <span className="text-3xl">💕</span>
          </div>
          <p className="text-lg font-black">Sin matches todavia...</p>
          <p className="text-sm text-gray-500">Cuando hagas match acá aparecerán tus conversaciones.</p>
          <Link href="/dashboard" className="mt-2 px-4 py-2 rounded-full bg-red-accent text-black font-bold uppercase text-xs tracking-[0.2em]">
            Explorar
          </Link>
        </section>
      )}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {reportOpen && reportUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-400 font-bold">Denunciar</p>
                <h3 className="text-lg font-black">{reportUser.nombre}</h3>
              </div>
              <button onClick={() => setReportOpen(false)} className="text-gray-400 hover:text-white">×</button>
            </div>
            <div className="space-y-3 mb-4">
              <label className="text-sm text-gray-300 font-semibold">Motivo</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-rose-400"
              >
                <option value="">Selecciona un motivo</option>
                {reasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 mb-6">
              <label className="text-sm text-gray-300 font-semibold">Mensaje (máx. 500)</label>
              <textarea
                maxLength={500}
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm min-h-[120px] focus:outline-none focus:border-rose-400"
                placeholder="Describe lo ocurrido"
              />
              <p className="text-[11px] text-gray-500 text-right">{reportMessage.length}/500</p>
            </div>
            <button
              onClick={submitReport}
              disabled={!reportReason || reportMessage.trim().length === 0}
              className="w-full bg-rose-500 text-black font-black uppercase tracking-[0.2em] py-3 rounded-full disabled:opacity-40 active:scale-95 transition"
            >
              Enviar reporte
            </button>
          </div>
        </div>
      )}
    </main>
  );
}