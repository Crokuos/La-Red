"use client";
import Link from "next/link";

export default function Landing() {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12 bg-[#02040a] text-white">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center scale-110 blur-3xl opacity-40" />
        <div className="absolute inset-0 bg-black/90" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.05),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_18%,rgba(255,255,255,0.05)_36%,rgba(255,255,255,0)_54%,rgba(255,255,255,0.05)_72%,rgba(255,255,255,0)_90%)] opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.7),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-md space-y-10 text-center">
        <div
          className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-900"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="flex items-baseline justify-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl font-semibold italic tracking-tight text-gray-400">LA</span>
            <span className="text-7xl md:8xl font-black italic tracking-tighter text-rose-400 drop-shadow-[0_0_30px_rgba(244,63,94,0.35)]">RED</span>
          </div>
          <p className="text-[12px] uppercase tracking-[0.35em] text-gray-400">Uruguay Exclusive</p>
        </div>

        <div
          className="space-y-5 px-3 animate-in fade-in slide-in-from-bottom-8 duration-900"
          style={{ animationDelay: "0.15s" }}
        >
          <p className="text-lg text-gray-200 font-semibold leading-relaxed">
            Sin vueltas. Sin dramas. Solo química.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            La red exclusiva para quienes saben lo que quieren y con quién lo quieren.
          </p>
        </div>

        <div
          className="flex flex-col gap-4 px-4 animate-in fade-in slide-in-from-bottom-8 duration-900"
          style={{ animationDelay: "0.25s" }}
        >
          <Link href="/registro" className="w-full">
            <button className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-black font-extrabold uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(244,63,94,0.35)] hover:shadow-[0_10px_50px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5">
              RECLAMAR MI LUGAR
            </button>
          </Link>
          <Link href="/login" className="w-full">
            <button className="w-full py-3 rounded-full border border-white/15 bg-white/5 text-gray-200 font-semibold uppercase tracking-[0.18em] hover:border-white/30 hover:bg-white/10 transition-all duration-200">
              VOLVER A ENTRAR
            </button>
          </Link>
        </div>

        <div
          className="text-[11px] text-gray-500 tracking-[0.25em] uppercase animate-in fade-in slide-in-from-bottom-8 duration-900"
          style={{ animationDelay: "0.35s" }}
        >
          Montevideo
        </div>
      </div>
    </main>
  );
}
