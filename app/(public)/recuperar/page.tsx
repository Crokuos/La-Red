"use client";

import Link from "next/link";
import { useState } from "react";

export default function Recuperar() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.includes("@")) {
      setError("Ingresá un email válido");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // TODO: replace with real endpoint
      await new Promise((res) => setTimeout(res, 900));
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "No pudimos enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#04060e] text-white flex flex-col items-center p-6 overflow-x-hidden">
      <div className="w-full max-w-md space-y-8 mt-16">
        <div className="space-y-2 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">Recuperar acceso</p>
          <h1 className="text-3xl font-black italic tracking-tight">Volver a entrar</h1>
          <p className="text-gray-400 text-sm">Ingresá el email que usaste al registrarte. Si tu perfil está activo, te enviaremos un enlace.</p>
        </div>

        {error && <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-2xl p-3">{error}</div>}

        {!sent ? (
          <div className="space-y-4">
            <input
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm placeholder-gray-500 focus:border-rose-500 outline-none"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-black font-bold uppercase tracking-[0.2em] disabled:opacity-40"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
            <Link href="/login" className="block text-center text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white">
              Volver a login
            </Link>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3 text-left">
            <p className="text-sm text-gray-300">Enviamos un enlace a {email}. Revisá tu bandeja y spam.</p>
            <p className="text-xs text-gray-500">Si no ves el correo en unos minutos, podés intentar de nuevo.</p>
            <button
              onClick={() => setSent(false)}
              className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white"
            >
              Enviar otro
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
