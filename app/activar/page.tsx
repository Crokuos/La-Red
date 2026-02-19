import Link from "next/link";
import { findApplicationByToken } from "../_lib/auth";
import ActivateClient from "./ActivateClient";

export default async function Activar({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token || null;
  const entry = await findApplicationByToken(token);

  if (!token) {
    return (
      <main className="min-h-screen bg-[#05070f] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-3xl font-black italic">Token requerido</h1>
          <p className="text-sm text-gray-300">No se puede acceder a la activación sin un token válido.</p>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">Volver</Link>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="min-h-screen bg-[#05070f] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-3xl font-black italic">Token inválido</h1>
          <p className="text-sm text-gray-300">El enlace no corresponde a ninguna solicitud.</p>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">Inicio</Link>
        </div>
      </main>
    );
  }

  if (entry.status !== "aprobado") {
    return (
      <main className="min-h-screen bg-[#05070f] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-3xl font-black italic">Aún sin aprobar</h1>
          <p className="text-sm text-gray-300">Esperá la aprobación para activar tu acceso.</p>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">Inicio</Link>
        </div>
      </main>
    );
  }

  return <ActivateClient token={token} />;
}
