"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Application, listPendingApplications, getApprovedGenderCounts, updateApplicationStatus } from "@/app/_lib/admissions";

export default function AdminApplications() {
  const [pending, setPending] = useState<Application[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [approvedCounts, setApprovedCounts] = useState({ hombres: 0, mujeres: 0 });

  const refresh = () => {
    const list = listPendingApplications();
    setPending(list);
    setApprovedCounts(getApprovedGenderCounts());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAction = (id: string, status: "aprobado" | "rechazado") => {
    const updated = updateApplicationStatus(id, status);
    if (!updated) return;
    setStatusMessage(
      status === "aprobado"
        ? `Solicitud aprobada. Link de activación: /activar?token=${updated.activation_token}`
        : "Solicitud rechazada"
    );
    refresh();
  };

  return (
    <main className="min-h-screen bg-[#05070f] text-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">Panel interno</p>
            <h1 className="text-3xl font-black italic">Solicitudes pendientes</h1>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">Volver</Link>
        </header>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Mujeres aprobadas</p>
            <p className="text-3xl font-black">{approvedCounts.mujeres}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Hombres aprobados</p>
            <p className="text-3xl font-black">{approvedCounts.hombres}</p>
          </div>
        </div>

        {statusMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-100 px-4 py-3 rounded-2xl text-sm">
            {statusMessage}
          </div>
        )}

        {pending.length === 0 ? (
          <div className="border border-white/10 rounded-3xl p-6 text-center text-gray-400 bg-white/5">
            No hay solicitudes en estado pendiente.
          </div>
        ) : (
          <div className="grid gap-4">
            {pending.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 shadow-[0_15px_50px_rgba(0,0,0,0.35)]"
              >
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-gray-400">
                    <span>{app.email}</span>
                    <span>Creado {new Date(app.created_at).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-200">
                    <p><span className="text-gray-500">Edad:</span> {app.age_range}</p>
                    <p><span className="text-gray-500">Género:</span> {app.gender}</p>
                    <p><span className="text-gray-500">Depto:</span> {app.department}</p>
                    <p><span className="text-gray-500">Barrio:</span> {app.zone}</p>
                    <p className="col-span-2"><span className="text-gray-500">Ocultar barrio:</span> {app.hide_from_same_zone ? "Sí" : "No"}</p>
                  </div>
                  <div className="space-y-1 text-gray-200">
                    <p><span className="text-gray-500">Busca:</span> {app.looking_for}</p>
                    <p><span className="text-gray-500">Valora:</span> {app.values.join(", ")}</p>
                    <p><span className="text-gray-500">Estilo social:</span> {app.social_style}</p>
                    <p className="text-gray-300"><span className="text-gray-500">Descripción:</span> {app.description}</p>
                    <p className="text-rose-300 text-sm font-semibold">Código: {app.verification_code}</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      className="px-4 py-3 rounded-2xl bg-emerald-500 text-black font-bold uppercase tracking-[0.2em] text-xs"
                      onClick={() => handleAction(app.id, "aprobado")}
                    >
                      Aprobar
                    </button>
                    <button
                      className="px-4 py-3 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-[0.2em] text-xs"
                      onClick={() => handleAction(app.id, "rechazado")}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
                <div className="relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden min-h-[240px]">
                  <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/80 uppercase tracking-[0.2em]">
                    Selfie
                  </div>
                  {app.selfie_url ? (
                    <img src={app.selfie_url} alt="Selfie verificación" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Sin imagen</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
