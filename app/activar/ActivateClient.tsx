"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Application, createUserFromApplication, getApplicationByToken } from "@/app/_lib/admissions";

export default function ActivateClient({ token }: { token: string }) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [realName, setRealName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const app = getApplicationByToken(token);
    if (!app) {
      setError("Token inválido o inexistente");
      setLoading(false);
      return;
    }
    if (app.status !== "aprobado") {
      setError("Esta solicitud no está aprobada todavía");
      setLoading(false);
      return;
    }
    setApplication(app);
    setLoading(false);
  }, [token]);

  const canSubmit = alias.trim().length > 0 && password.length >= 10 && !!application;

  const handleSubmit = async () => {
    if (!application || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await createUserFromApplication({
        token,
        alias: alias.trim(),
        password,
        real_name: realName.trim() || undefined,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "No se pudo activar el acceso");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070f] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">Fase 2</p>
            <h1 className="text-3xl font-black italic">Activar acceso</h1>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">Inicio</Link>
        </div>

        {loading && (
          <div className="border border-white/10 rounded-3xl bg-white/5 p-6 animate-pulse text-gray-500">
            Verificando token...
          </div>
        )}

        {!loading && error && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-100 rounded-3xl p-6">
            {error}
          </div>
        )}

        {!loading && application && (
          <div className="space-y-5">
            <div className="border border-white/10 rounded-3xl bg-white/5 p-5 text-sm text-gray-200">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Solicitud aprobada</p>
              <p><span className="text-gray-500">Email:</span> {application.email}</p>
              <p><span className="text-gray-500">Depto / barrio:</span> {application.department} — {application.zone}</p>
              <p><span className="text-gray-500">Código verificado:</span> {application.verification_code}</p>
            </div>

            {error && (
              <div className="border border-red-500/40 bg-red-500/10 text-red-100 rounded-2xl p-3 text-sm">
                {error}
              </div>
            )}

            <div className="border border-white/10 rounded-3xl bg-white/5 p-5 space-y-4">
              <div className="space-y-2 text-sm">
                <label className="block text-gray-400 text-xs uppercase tracking-[0.2em]">Alias</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm placeholder-gray-500 focus:border-rose-500 outline-none"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Tu nombre visible en la red"
                />
              </div>
              <div className="space-y-2 text-sm">
                <label className="block text-gray-400 text-xs uppercase tracking-[0.2em]">Contraseña (mín. 10)</label>
                <input
                  type="password"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm placeholder-gray-500 focus:border-rose-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                />
              </div>
              <div className="space-y-2 text-sm">
                <label className="block text-gray-400 text-xs uppercase tracking-[0.2em]">Nombre real (opcional)</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm placeholder-gray-500 focus:border-rose-500 outline-none"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="Solo para administración"
                />
              </div>
              <button
                disabled={!canSubmit || submitting}
                onClick={handleSubmit}
                className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-black font-bold uppercase tracking-[0.2em] disabled:opacity-30"
              >
                {submitting ? "Activando..." : "Activar acceso"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
